using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SolaceUtil.Core.Service.Classes
{
    public class SolaceUtilException : Exception
    {
        public SolaceReturnCode returnCode { get; set; }
        public SolaceUtilException()
        {
        }

        public SolaceUtilException(string message)
            : base(message)
        {
        }

        public SolaceUtilException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }

    public enum SolaceReturnCode
    {
        //
        // Summary:
        //     The API call was successful.
        SOLCLIENT_OK = 0,
        //
        // Summary:
        //     An API call would block, but non-blocking was requested.
        SOLCLIENT_WOULD_BLOCK = 1,
        //
        // Summary:
        //     The API call is in progress (non-blocking mode).
        SOLCLIENT_IN_PROGRESS = 2,
        //
        // Summary:
        //     The API could not complete because the object is not ready (for example, the
        //     session is not connected).
        SOLCLIENT_NOT_READY = 3,
        //
        // Summary:
        //     A get next operation on structured container returned End-of-Stream.
        SOLCLIENT_EOS = 4,
        //
        // Summary:
        //     A get for a named field in a MAP was not found.
        SOLCLIENT_NOT_FOUND = 5,
        //
        // Summary:
        //     The context had no events to process.
        SOLCLIENT_NOEVENT = 6,
        //
        // Summary:
        //     The API call completed some, but not all, of the requested function.
        SOLCLIENT_INCOMPLETE = 7,
        //
        // Summary:
        //     SolaceSystems.Solclient.Messaging.ITransactedSession.Commit returns this when
        //     the transaction has already been rolled back.
        SOLCLIENT_ROLLBACK = 8,
        //
        // Summary:
        //     The API call failed.
        SOLCLIENT_FAIL = -1
    }
}
