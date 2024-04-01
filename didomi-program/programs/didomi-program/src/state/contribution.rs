use anchor_lang::prelude::*;

#[anchor]
pub struct contribution {
    pub contributor_address: Pubkey,
    pub project_address: Pubkey,
    pub amount: u64,
    pub message: [u8; 280],
    pub token_type: u8,
}
