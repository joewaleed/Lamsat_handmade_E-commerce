using System;
using System.Collections.Generic;

namespace Lamasat.Infastructure;

public partial class Seller
{
    public int SellerId { get; set; }

    public int UserId { get; set; }

    public string StoreName { get; set; } = null!;

    public string? StoreDescription { get; set; }

    public string? StoreLogo { get; set; }

    public decimal Balance { get; set; }

    public string VerificationStatus { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Withdrawal> Withdrawals { get; set; } = new List<Withdrawal>();
}
