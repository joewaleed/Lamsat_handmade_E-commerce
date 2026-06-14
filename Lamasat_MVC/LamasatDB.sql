CREATE DATABASE LamasatDB
GO
USE LamasatDB;
GO

--Tables

CREATE TABLE Users (
    UserID      INT IDENTITY(1,1) PRIMARY KEY,
    FirstName   NVARCHAR(50)  NOT NULL,
    LastName    NVARCHAR(50)  NOT NULL,
    Email       NVARCHAR(100) NOT NULL UNIQUE,
    Password    NVARCHAR(256) NOT NULL, -- hashed (bcrypt/SHA256)
    PhoneNo     NVARCHAR(15)  NULL,
    Address     NVARCHAR(255) NULL,
    ProfileImage NVARCHAR(500) NULL,
    Role        NVARCHAR(20)  NOT NULL DEFAULT 'Buyer' 
                CHECK (Role IN ('Buyer', 'Seller', 'Admin')),
    IsActive    BIT           NOT NULL DEFAULT 1,
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Sellers (
    SellerID            INT IDENTITY(1,1) PRIMARY KEY,
    UserID              INT           NOT NULL UNIQUE,
    StoreName           NVARCHAR(100) NOT NULL UNIQUE,
    StoreDescription    NVARCHAR(500) NULL,
    StoreLogo           NVARCHAR(500) NULL,
    Balance             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    VerificationStatus  NVARCHAR(20)  NOT NULL DEFAULT 'Pending'
                        CHECK (VerificationStatus IN ('Pending', 'Verified', 'Rejected')),
    CreatedAt           DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Sellers_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

CREATE TABLE Categories (
    CategoryID      INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName    NVARCHAR(100) NOT NULL UNIQUE,
    SubCategory     NVARCHAR(100) NULL,
    ParentID        INT           NULL,
    CONSTRAINT FK_Categories_Parent FOREIGN KEY (ParentID) REFERENCES Categories(CategoryID)
);
GO

CREATE TABLE Products (
    ProductID       INT IDENTITY(1,1) PRIMARY KEY,
    SellerID        INT            NOT NULL,
    CategoryID      INT            NOT NULL,
    Title           NVARCHAR(200)  NOT NULL,
    Description     NVARCHAR(1000) NULL,
    Price           DECIMAL(10,2)  NOT NULL CHECK (Price > 0),
    Discount        DECIMAL(5,2)   NOT NULL DEFAULT 0.00 CHECK (Discount >= 0 AND Discount <= 100),
    Stock           INT            NOT NULL DEFAULT 0 CHECK (Stock >= 0),
    Images          NVARCHAR(MAX)  NULL, -- JSON array of image URLs
    IsActive        BIT            NOT NULL DEFAULT 1,
    CreatedAt       DATETIME       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Products_Sellers    FOREIGN KEY (SellerID)   REFERENCES Sellers(SellerID),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
GO

CREATE TABLE Orders (
    OrderID         INT IDENTITY(1,1) PRIMARY KEY,
    UserID          INT            NOT NULL,
    TotalAmount     DECIMAL(10,2)  NOT NULL CHECK (TotalAmount >= 0),
    PlatformCut     DECIMAL(10,2)  NOT NULL DEFAULT 0.00, -- 10% commission
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'Pending'
                    CHECK (Status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
    CreatedAt       DATETIME       NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

CREATE TABLE OrderItems (
    OrderItemID     INT IDENTITY(1,1) PRIMARY KEY,
    OrderID         INT            NOT NULL,
    ProductID       INT            NOT NULL,
    Quantity        INT            NOT NULL CHECK (Quantity > 0),
    UnitPrice       DECIMAL(10,2)  NOT NULL CHECK (UnitPrice > 0),
    CONSTRAINT FK_OrderItems_Orders   FOREIGN KEY (OrderID)   REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
GO

CREATE TABLE Payments (
    PaymentID       INT IDENTITY(1,1) PRIMARY KEY,
    OrderID         INT            NOT NULL UNIQUE,
    Method          NVARCHAR(50)   NOT NULL 
                    CHECK (Method IN ('Paymob', 'CashOnDelivery', 'BankTransfer')),
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'Pending'
                    CHECK (Status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    TransactionDate DATETIME       NULL,
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
GO

CREATE TABLE Reviews (
    ReviewID    INT IDENTITY(1,1) PRIMARY KEY,
    UserID      INT           NOT NULL,
    ProductID   INT           NOT NULL,
    Rating      INT           NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    Comment     NVARCHAR(500) NULL,
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Reviews_Users    FOREIGN KEY (UserID)    REFERENCES Users(UserID),
    CONSTRAINT FK_Reviews_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT UQ_Reviews_UserProduct UNIQUE (UserID, ProductID) -- one review per product per user
);
GO

CREATE TABLE Withdrawals (
    WithdrawalID    INT IDENTITY(1,1) PRIMARY KEY,
    SellerID        INT            NOT NULL,
    Amount          DECIMAL(10,2)  NOT NULL CHECK (Amount > 0),
    Method          NVARCHAR(50)   NOT NULL
                    CHECK (Method IN ('BankTransfer', 'InstaPay', 'Vodafone Cash')),
    Status          NVARCHAR(20)   NOT NULL DEFAULT 'Pending'
                    CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    RequestedAt     DATETIME       NOT NULL DEFAULT GETDATE(),
    ProcessedAt     DATETIME       NULL,
    CONSTRAINT FK_Withdrawals_Sellers FOREIGN KEY (SellerID) REFERENCES Sellers(SellerID)
);
GO

--Indexes: for better performance (you can neglect them)
CREATE INDEX IX_Products_SellerID    ON Products(SellerID);
CREATE INDEX IX_Products_CategoryID  ON Products(CategoryID);
CREATE INDEX IX_Orders_UserID        ON Orders(UserID);
CREATE INDEX IX_OrderItems_OrderID   ON OrderItems(OrderID);
CREATE INDEX IX_OrderItems_ProductID ON OrderItems(ProductID);
CREATE INDEX IX_Reviews_ProductID    ON Reviews(ProductID);
CREATE INDEX IX_Withdrawals_SellerID ON Withdrawals(SellerID);
GO

--Procedures: for better security
CREATE PROCEDURE sp_RegisterUser
    @FirstName      NVARCHAR(50),
    @LastName       NVARCHAR(50),
    @Email          NVARCHAR(100),
    @HashedPassword NVARCHAR(256),
    @PhoneNo        NVARCHAR(15) = NULL,
    @Address        NVARCHAR(255) = NULL,
    @Role           NVARCHAR(20) = 'Buyer'
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        RAISERROR('Email already registered.', 16, 1);
        RETURN;
    END

    IF @Role NOT IN ('Buyer', 'Seller', 'Admin')
    BEGIN
        RAISERROR('Invalid role specified.', 16, 1);
        RETURN;
    END

    INSERT INTO Users (FirstName, LastName, Email, Password, PhoneNo, Address, Role)
    VALUES (@FirstName, @LastName, @Email, @HashedPassword, @PhoneNo, @Address, @Role);

    SELECT SCOPE_IDENTITY() AS NewUserID;
END
GO

CREATE PROCEDURE sp_LoginUser
    @Email          NVARCHAR(100),
    @HashedPassword NVARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT UserID, FirstName, LastName, Email, Role, IsActive
    FROM Users
    WHERE Email = @Email
      AND Password = @HashedPassword
      AND IsActive = 1;
END
GO
CREATE PROCEDURE sp_PlaceOrder
    @UserID     INT,
    @TotalAmount DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Users WHERE UserID = @UserID AND IsActive = 1)
        BEGIN
            RAISERROR('Invalid or inactive user.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        DECLARE @PlatformCut DECIMAL(10,2) = @TotalAmount * 0.10;

        INSERT INTO Orders (UserID, TotalAmount, PlatformCut, Status)
        VALUES (@UserID, @TotalAmount, @PlatformCut, 'Pending');

        SELECT SCOPE_IDENTITY() AS NewOrderID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

CREATE PROCEDURE sp_AddOrderItem
    @OrderID    INT,
    @ProductID  INT,
    @Quantity   INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @Stock      INT;
        DECLARE @UnitPrice  DECIMAL(10,2);
        DECLARE @IsActive   BIT;

        SELECT @Stock = Stock, @UnitPrice = Price, @IsActive = IsActive
        FROM Products
        WHERE ProductID = @ProductID;

        IF @Stock IS NULL
        BEGIN
            RAISERROR('Product not found.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @IsActive = 0
        BEGIN
            RAISERROR('Product is no longer available.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @Stock < @Quantity
        BEGIN
            RAISERROR('Insufficient stock.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice)
        VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice);

        UPDATE Products SET Stock = Stock - @Quantity
        WHERE ProductID = @ProductID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

CREATE PROCEDURE sp_RequestWithdrawal
    @SellerID   INT,
    @Amount     DECIMAL(10,2),
    @Method     NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @Balance DECIMAL(10,2);

        SELECT @Balance = Balance FROM Sellers WHERE SellerID = @SellerID;

        IF @Balance IS NULL
        BEGIN
            RAISERROR('Seller not found.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        IF @Balance < @Amount
        BEGIN
            RAISERROR('Insufficient balance for withdrawal.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE Sellers SET Balance = Balance - @Amount
        WHERE SellerID = @SellerID;

        INSERT INTO Withdrawals (SellerID, Amount, Method, Status)
        VALUES (@SellerID, @Amount, @Method, 'Pending');

        SELECT SCOPE_IDENTITY() AS NewWithdrawalID;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

CREATE PROCEDURE sp_SubmitReview
    @UserID     INT,
    @ProductID  INT,
    @Rating     INT,
    @Comment    NVARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Reviews WHERE UserID = @UserID AND ProductID = @ProductID)
    BEGIN
        RAISERROR('You have already reviewed this product.', 16, 1);
        RETURN;
    END

    IF @Rating < 1 OR @Rating > 5
    BEGIN
        RAISERROR('Rating must be between 1 and 5.', 16, 1);
        RETURN;
    END

    INSERT INTO Reviews (UserID, ProductID, Rating, Comment)
    VALUES (@UserID, @ProductID, @Rating, @Comment);
END
GO

CREATE PROCEDURE sp_DeactivateUser
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users SET IsActive = 0
    WHERE UserID = @UserID;
END
GO

CREATE PROCEDURE sp_GetSellerBalance
    @SellerID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT SellerID, StoreName, Balance
    FROM Sellers
    WHERE SellerID = @SellerID;
END
GO