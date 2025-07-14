namespace IDMS.Models
{
    public static class EventId
    {
        public const string NEW_INGATE = "2000";
        public const string UPDATE_INGATE = "2001";
        public const string NEW_OUTGATE = "2002";
        public const string UPDATE_OUTGATE = "2003";
        public const string PUBLISH_EIR = "2020";
        public const string NEW_SOT = "2010";
        public const string UPDATE_SOT = "2011";
        public const string CANCEL_SOT = "2012";
        public const string DELETE_SOT = "2013";
    }

    public static class EventName
    {
        public const string NEW_INGATE = "New In-Gate Inserted";
        public const string NEW_OUTGATE = "New Out-Gate Inserted";
        public const string NEW_SOT = "New SOT Inserted";
    }
}
