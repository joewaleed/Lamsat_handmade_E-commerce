using System;
using System.Collections.Generic;

namespace Lamasat.Infastructure;

public partial class Order
{
    public int OrderId { get; set; }

    public int UserId { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal PlatformCut { get; set; }

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual Payment? Payment { get; set; }

    public virtual User User { get; set; } = null!;
}
