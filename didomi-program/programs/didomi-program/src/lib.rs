use anchor_lang::prelude::*;

declare_id!("4f8xSv3wUdYUe2z343s4M2WRH7Hy2zr7Mdmpi31Y59bY");

#[program]
pub mod didomi_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
