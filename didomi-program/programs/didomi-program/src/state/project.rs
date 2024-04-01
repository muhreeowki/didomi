use anchor_lang::prelude::*;

// Struct to represent a Donation AD
// TODO: Figure out how to store variable string values
#[account]
pub struct ProjectData {
    pub title: [u8; 120],
    pub description: [u8; 1000],
    pub target_amount: u64,
    pub current_amount: u64,
    pub start_date: [u8; 30],
    pub end_date: [u8; 30],
    pub project_address: Pubkey,
    pub beneficiary_address: Pubkey,
    pub contributors: [u8; 5], // Needs to store a variable list of Contributors
    pub project_status: String,
    pub images: [[u8; 120]; 5],
    pub project_url: [u8; 120],
    pub organizer_name: [u8; 120],
    pub project_type: u8,
}
