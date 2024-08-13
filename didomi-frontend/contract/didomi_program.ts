/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/didomi_program.json`.
 */
export type DidomiProgram = {
  "address": "SNNuq33tepwjoqeRCj3GcNkW4R4hZF88pNMewZbxWyT",
  "metadata": {
    "name": "didomiProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createDonation",
      "discriminator": [
        7,
        156,
        37,
        211,
        55,
        14,
        137,
        121
      ],
      "accounts": [
        {
          "name": "donor",
          "writable": true,
          "signer": true
        },
        {
          "name": "projectOwner"
        },
        {
          "name": "projectAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "projectOwner"
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  111,
                  108,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "projectEscrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "project_account.owner_address",
                "account": "projectData"
              },
              {
                "kind": "account",
                "path": "projectAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "tokenType",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createProject",
      "discriminator": [
        148,
        219,
        181,
        42,
        221,
        114,
        145,
        190
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  111,
                  108,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "ownerId",
          "type": "u64"
        },
        {
          "name": "title",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        },
        {
          "name": "targetAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deleteProject",
      "discriminator": [
        225,
        5,
        3,
        226,
        80,
        93,
        171,
        122
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  111,
                  108,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateProject",
      "discriminator": [
        2,
        196,
        131,
        92,
        28,
        139,
        179,
        94
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "project",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  111,
                  108,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "escrow",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
              },
              {
                "kind": "account",
                "path": "project"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "title",
          "type": {
            "array": [
              "u8",
              64
            ]
          }
        },
        {
          "name": "targetAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowData",
      "discriminator": [
        249,
        142,
        239,
        239,
        106,
        183,
        96,
        92
      ]
    },
    {
      "name": "projectData",
      "discriminator": [
        248,
        128,
        251,
        0,
        71,
        204,
        69,
        32
      ]
    }
  ],
  "types": [
    {
      "name": "escrowData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ownerId",
            "docs": [
              "Owner's id"
            ],
            "type": "u64"
          },
          {
            "name": "ownerAddress",
            "docs": [
              "Owner's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "projectAddress",
            "docs": [
              "Projects's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "currentAmount",
            "docs": [
              "Current amount raised (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "reserve",
            "docs": [
              "Reserved space (48 bytes)"
            ],
            "type": {
              "array": [
                "u8",
                48
              ]
            }
          }
        ]
      }
    },
    {
      "name": "projectData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Project ID (8)"
            ],
            "type": "u64"
          },
          {
            "name": "title",
            "docs": [
              "Project name (64 bytes)"
            ],
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          },
          {
            "name": "ownerId",
            "docs": [
              "Owner's id"
            ],
            "type": "u64"
          },
          {
            "name": "ownerAddress",
            "docs": [
              "Owner's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "escrowAddress",
            "docs": [
              "Escrow's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "targetAmount",
            "docs": [
              "Target amount (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "currentAmount",
            "docs": [
              "Current amount raised (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "reserve",
            "docs": [
              "Reserved space (96 bytes)"
            ],
            "type": {
              "array": [
                "u8",
                96
              ]
            }
          }
        ]
      }
    }
  ]
};
