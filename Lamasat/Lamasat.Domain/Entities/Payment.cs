using System;
using System.Collections.Generic;

namespace Lamasat.Infastructure;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public string Method { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime? TransactionDate { get; set; }

    public virtual Order Order { get; set; } = null!;
}
