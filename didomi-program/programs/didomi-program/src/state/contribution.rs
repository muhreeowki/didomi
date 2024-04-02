use anchor_lang::prelude::*;

#[account]
pub struct Contribution {
    // contributor_address: The public key (Pubkey) of the contributor/donor
    pub contributor_address: Pubkey,
    // project_address: The public key (Pubkey) of the project receiving the contribution
    pub project_address: Pubkey,
    // amount: The amount of contribution/donation in the smallest unit of the token
    pub amount: u64,
    // message: A fixed-size byte array to store a message or note from the contributor
    pub message: [u8; 128],
    // token_type: A single byte to represent the type of token used for the contribution
    pub token_type: u8,
    // padding: A fixed-size byte array added to ensure proper alignment and padding
    pub _reserve: [u8; 32],
}
