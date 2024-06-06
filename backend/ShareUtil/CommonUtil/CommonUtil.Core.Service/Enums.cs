using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonUtil.Core.Service
{
    public enum TaskID
    {
        #region request id
        START,
        STOP,
        OPEN, // gantry
        CLOSE, // gantry
        NEW, // screen
        UPDATE, // screen
        INITIALISE, // screen
        ACTIVATE, //change lane mode
        DEACTIVATE,
        LANEALERT,
        EXCEPTION,
        #endregion request id

        #region both id
        HEARTBEAT,
        SCANSTATUS,
        CAPTURESTATUS,
        DEVICEINFO,
        BARRIERSTATE,
        SENSORSTATE,
        MODETYPE,
        LOCALBIOENROL,
        LOCALBIOONETOMANYMATCHING,
        LOCALBIODELETE,
        LOCALBIOCLEARDB,
        LOCALBIOPHOTOSMATCHING,
        KIOSKSTATUS,
        MOVEMENTCONTROL,
        IOCONTROL,
        KIOSKINIT,
        VEHICLESTATUS,
        CONFIGURE,
        KIOSKLED,
        SCREENCONTROL,
        DBQUERY,
        DBCREATE,
        NTQUERY,
        NTENROL,
        NTUPDATE,
        NTRETRIEVESUBJECT,
        COMPONENT,
        #endregion both id

        #region response id
        BUTTONCLICKED,
        COMPLETED,
        DOCUMENTDETECTED,
        MRZCOMPLETED,
        FAILED,
        TIMEOUT,
        #endregion response id
    }

    public enum WorkFlowEndState
    {
        NORMAL,
        WARNING,
        FAILED,
        EXCEPTION,
        TIMEOUT
    }

    public enum BarrierType
    {
        ENTRY,
        EXIT
    }

    public enum BarrierMode
    {
        CAR,
        BIKES
    }

    public enum BarrierStatus
    {
        OPENED,
        CLOSED,
        YES,
        NO,
        OCCUPIED,
        VACANT
    }

    public enum ServiceStatus
    {
        RUNNING,
        STOP,
        STANDBY,
        BUSY,
        COMPLETED
    }

    public enum ClearStatus
    {
        NOT_CLEAR,
        CLEAR
    }

    public enum FingerprintScanType
    {
        RIGHTTHUMB,
        RIGHTINDEX,
        RIGHTMIDDLE,
        RIGHTRING,
        RIGHTLITTLE,
        LEFTTHUMB,
        LEFTINDEX,
        LEFTMIDDLE,
        LEFTRING,
        LEFTLITTLE,
        RIGHTFOUR,
        LEFTFOUR,
        TWOTHUMBS
    }

    public enum IrisCaptureType
    {
        NONE,
        LEFT,
        RIGHT,
        BOTH
    }

    public enum FaceIrisStartType
    {
        CAPTURE,
        STREAM,
        APPROACH
    }

    public enum FaceIrisReturnType
    {
        APPROACHED,
        CAPTUREFAILED,
        FAKEFACE,
        FAKEIRIS,
        FAILEDDETECTED,
        CAPTURECOMPLETED,
        CAPTURETIMEOUT,
        COMMANDFAILED,
        BUSY,
        PARAMERROR,
        EXCEPTION
    }

    public enum PVReturnStatus
    {
        MissingParam = -1,
        Failed = 0,
        Ok = 1
    }

    public enum PVMatchingResult
    {
        Matched,
        NotMatched
    }

    public enum ScreenInteraction
    {
        YES,
        NO
    }

    public enum NTMatchingResult
    {
        NONE,
        MATCHED,
        NOTMATCHED,
        REJECTED,
        IN_PROGRESS,
        OK,
        NOT_MATCHED,
    }

    public enum ScreenZone
    {
        All,
        RiderScreen,
        PillionScreen
    }

    public enum ScreenAsset
    {
        NONE,
        Idle,
        Enter,
        Exit,
        PleaseWait,
        WaitForAssistance,
        EntryObstructed,
        ExitObstructed,
        BarcodeScan,
        PPInsert,
        PPScanning,
        PPRemove,
        PPDuplicated,
        PPHasBeenScanned,
        PPRetry,
        RightHandScan,
        LeftHandScan,
        TwoThumbsScan,
        RightThumbScan,
        LeftThumbScan,
        LookAtCamera,
        RemoveOrnaments,
        Inactive,
        ApicsDeclaration,
        DifferentAlpr,
        MakePayment,
        Apics_Failed_Biometric,
        Apics_Passed_Biometric,
        ApicsTabletRelease,
        ApicsTabletReturn,
        WaitOthersToComplete,
        BiometricsClearanceCompleted,
        PaymentSuccessful,
        ClearanceCompleted,
        PreConfirmPPC,
        TakeTablet,
        ReturnTablet
    }
}
