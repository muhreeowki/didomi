use anchor_lang::prelude::*;
// Struct to represent a Donation
#[account]
pub struct Contribution {
    /// Contribution ID
    pub id: u64,
    /// Contributor's public key
    pub contributor: Pubkey,
    /// Project's public key
    pub project: Pubkey,
    /// Contribution amount (in smallest token unit)
    pub amount: u64,
    /// Transaction hash (32 bytes)
    pub transaction_hash: [u8; 32],
    /// Token type
    pub token_type: u8,
    /// Timestamp (24 bytes)
    pub timestamp: [u8; 24],
    /// Reserved space (33 bytes)
    pub _reserve: [u8; 33],
}
