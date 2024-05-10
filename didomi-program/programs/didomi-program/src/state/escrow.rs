use anchor_lang::prelude::*;
// Struct to represent a Project
#[account]
pub struct EscrowData {
    /// Owner's id
    pub owner_id: u64,
    /// Owner's public key
    pub owner_address: Pubkey,
    /// Projects's public key
    pub project_address: Pubkey,
    /// Current amount raised (in lamports)
    pub current_amount: u64,
    /// Reserved space (48 bytes)
    pub _reserve: [u8; 48],
}
