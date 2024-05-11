mod instructions;
pub mod state;
use self::instructions::*;
use self::state::*;

use anchor_lang::prelude::*;

declare_id!("SNNuq33tepwjoqeRCj3GcNkW4R4hZF88pNMewZbxWyT");

#[program]
pub mod didomi_program {
    use super::*;
    // Create project instruction
    pub fn create_project(
        ctx: Context<CreateProject>,
        id: u64,
        owner_id: u64,
        title: [u8; 64],
        target_amount: u64,
    ) -> Result<()> {
        create_project_handler(ctx, id, owner_id, title, target_amount)?;
        Ok(())
    }

    // Update project instruction
    pub fn update_project(
        ctx: Context<UpdateProject>,
        id: u64,
        owner_id: u64,
        title: [u8; 64],
        target_amount: u64,
    ) -> Result<()> {
        update_project_handler(ctx, id, owner_id, title, target_amount)?;
        Ok(())
    }

    // Delete project instruction
    pub fn delete_project(ctx: Context<DeleteProject>) -> Result<()> {
        delete_project_handler(ctx)?;
        Ok(())
    }

    // Contribution instruction
    pub fn create_donation(
        ctx: Context<CreateDonation>,
        amount: u64,
        token_type: u8,
    ) -> Result<()> {
        create_donation_handler(ctx, amount, token_type)?;
        Ok(())
    }
}
