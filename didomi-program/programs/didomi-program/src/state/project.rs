use anchor_lang::prelude::*;
// Struct to represent a Project
#[account]
pub struct ProjectData {
    /// Project ID
    pub id: u64,
    /// Project name (32 bytes)
    pub name: [u8; 32],
    /// Start date (Unix timestamp)
    pub start_date: i64,
    /// End date (Unix timestamp)
    pub end_date: i64,
    /// Owner's public key
    pub owner: Pubkey,
    /// Target amount (in lamports)
    pub target_amount: u64,
    /// Current amount raised (in lamports)
    pub current_amount: u64,
    /// Project status
    pub status: u8,
    /// Reserved space (19 bytes)
    pub _reserve: [u8; 23],
}
