using System;
using System.Collections.Generic;

namespace Lamasat.Infastructure;

public partial class Product
{
    public int ProductId { get; set; }

    public int SellerId { get; set; }

    public int CategoryId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public decimal Discount { get; set; }

    public int Stock { get; set; }

    public string? Images { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual Seller Seller { get; set; } = null!;
}
