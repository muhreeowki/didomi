export class SolanaError extends Error {
  constructor(message = "Could not send Transaction.") {
    super(message);
  }
}

export class BackendError extends Error {
  constructor(message = "Unable Fetch Data.") {
    super(message);
  }
}
