namespace Klex_Logistics.Schema.UserSchema;

public class UserSchema
{
    public required int AccountID { get; set; }
    public required string AccountName { get; set; }
    public required string AccountEmail { get; set; }
    public required DateTime AccountStartDate { get; set; }
    public required int AccountTransactions { get; set; }
    public required bool AccountBeingCharged { get; set; }
    public required int PlanCount { get; set; }
    public Plan?[] Plans { get; set; }
    public PowerYears?[] PowerYears { get; set; }
}
public class Plan
{
    public required int PlanID { get; set; }
    public required string PlanName { get; set; }
    public required DateTime PlanStartDate { get; set; }
    public required DateTime PlanEndDate { get; set; }
    public required bool PlanCompleted { get; set; }
}
public class PowerYears
{
    public required int[] Year { get; set; }
    public required int[] January { get; set; } 
    public required int[] February { get; set; } 
    public required int[] March { get; set; } 
    public required int[] April { get; set; } 
    public required int[] May { get; set; } 
    public required int[] June { get; set; } 
    public required int[] July { get; set; } 
    public required int[] August { get; set; } 
    public required int[] September { get; set; } 
    public required int[] October { get; set; } 
    public required int[] November { get; set; } 
    public required int[] December { get; set; } 
}