use anchor_lang::prelude::*;
// Struct to represent a Project
#[account]
pub struct ProjectData {
    /// Project ID (8)
    pub id: u64,
    /// Project name (64 bytes)
    pub title: [u8; 64],
    /// Owner's id
    pub owner_id: u64,
    /// Owner's public key
    pub owner_address: Pubkey,
    /// Escrow's public key
    pub escrow_address: Pubkey,
    /// Target amount (in lamports)
    pub target_amount: u64,
    /// Current amount raised (in lamports)
    pub current_amount: u64,
    /// Reserved space (96 bytes)
    pub _reserve: [u8; 96],
}
