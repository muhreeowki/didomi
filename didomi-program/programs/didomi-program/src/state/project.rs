use anchor_lang::prelude::*;

// Struct to represent a Project Donation AD
#[account]
pub struct ProjectData {
    pub title: [u8; 120],
    pub description: [u8; 2000],
    pub target_amount: u64,
    pub current_amount: u64,
    pub start_date: [u8; 30],
    pub end_date: [u8; 30],
    pub owner_address: Pubkey,
    pub beneficiary_address: Pubkey,
    pub project_status: u8,
    pub images: [[u8; 120]; 5],
    pub project_url: [u8; 120],
    pub organizer_name: [u8; 120],
    pub project_type: u8,
}
