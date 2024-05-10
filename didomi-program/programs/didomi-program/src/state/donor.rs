use anchor_lang::prelude::*;
// Struct to represent a Donation
#[account]
pub struct Donation {
    /// Contributor's public key
    pub donor: Pubkey,
    /// Project's public key
    pub project: Pubkey,
    /// Contribution amount (in smallest token unit)
    pub amount: u64,
    /// Token type
    pub token_type: u8,
    /// Reserved space (33 bytes)
    pub _reserve: [u8; 49],
}
