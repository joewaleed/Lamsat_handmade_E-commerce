using System;
using System.Collections.Generic;

namespace Lamasat.Infastructure;

public partial class Withdrawal
{
    public int WithdrawalId { get; set; }

    public int SellerId { get; set; }

    public decimal Amount { get; set; }

    public string Method { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime RequestedAt { get; set; }

    public DateTime? ProcessedAt { get; set; }

    public virtual Seller Seller { get; set; } = null!;
}
