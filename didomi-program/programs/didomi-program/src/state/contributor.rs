use anchor_lang::prelude::*;

#[account]
pub struct Contributor {
    pub total_contributions: u64,
}
