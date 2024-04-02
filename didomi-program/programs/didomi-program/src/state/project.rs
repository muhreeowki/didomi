use anchor_lang::prelude::*;
// Struct to represent a Project Donation AD
#[account]
pub struct ProjectData {
    /// title: Title of the project
    pub title: [u8; 64],
    /// description: Short description about the project
    pub description: [u8; 256],
    /// organizer_name: Name of organizer or onwer of this project
    pub organizer_name: [u8; 24],
    /// organizer_address: Wallet address of the owner of the project.
    pub organizer_address: Pubkey,
    /// target_amount: The finiancial target of the project
    pub target_amount: u64,
    /// current_amount: The current amount donated to the project so far
    pub current_amount: u64,
    /// beneficiary_address: Wallet address of the account to recieve donations
    // pub beneficiary_address: Pubkey,
    /// _reserve: Reserved space
    pub _reserve: [u8; 32],
}
