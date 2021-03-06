export default [
  {
    title: 'Search groups',
    url: '/groups',
    method: 'GET',
    query: [
      {
        field: 'title',
        type: 'string',
        description: 'A partial name match. - Optional'
      }
    ],
    successResponses: [
      {
        description: '',
        body: [
          {
            id: 1,
            name: 'Hexis',
            createdAt: '2020-04-18T08:37:24.190Z',
            updatedAt: '2020-04-18T08:37:24.190Z'
          },
          {
            id: 2,
            name: 'RSPT',
            createdAt: '2020-04-18T08:45:28.726Z',
            updatedAt: '2020-04-18T08:47:50.870Z'
          },
          {
            id: 4,
            name: 'Varrock Titans',
            createdAt: '2020-04-18T09:01:10.630Z',
            updatedAt: '2020-04-18T09:07:00.915Z'
          }
        ]
      }
    ]
  },
  {
    title: 'View group',
    url: '/groups/:id',
    method: 'GET',
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    successResponses: [
      {
        description: '',
        body: {
          id: 4,
          name: 'RSPT',
          createdAt: '2020-04-18T09:01:10.630Z',
          updatedAt: '2020-04-18T09:07:00.915Z',
          members: [
            {
              id: 61,
              username: 'Psikoi',
              type: 'regular',
              lastImportedAt: '2020-04-18T02:22:49.364Z',
              registeredAt: '2020-04-10T18:11:02.544Z',
              updatedAt: '2020-04-18T04:02:42.235Z',
              role: 'leader'
            },
            {
              id: 93,
              username: 'Zulu',
              type: 'regular',
              lastImportedAt: null,
              registeredAt: '2020-04-18T02:22:56.415Z',
              updatedAt: '2020-04-18T06:44:28.660Z',
              role: 'leader'
            },
            {
              id: 77,
              username: 'Zezima',
              type: 'regular',
              lastImportedAt: '2020-04-11T01:02:25.132Z',
              registeredAt: '2020-04-11T01:02:06.424Z',
              updatedAt: '2020-04-18T03:40:17.940Z',
              role: 'member'
            }
          ]
        }
      }
    ],
    errorResponses: [
      {
        description: 'If no id is given.',
        body: {
          message: 'Invalid group id.'
        }
      },
      {
        description: 'If the given id does not exist.',
        body: {
          message: 'Group of id 4553 was not found.'
        }
      }
    ]
  },
  {
    title: 'Create group',
    url: '/groups',
    method: 'POST',
    comments: [
      {
        type: 'error',
        content:
          'The response will contain a "verificationCode", this code must be stored \
           as it is not possible to edit or delete the group at a later date without it.'
      }
    ],
    body: {
      name: 'Falador Knights',
      members: ['Zezima', 'Psikoi']
    },
    successResponses: [
      {
        description: '',
        body: {
          id: 5,
          name: 'Falador Knights',
          verificationCode: '926-579-976',
          updatedAt: '2020-04-18T09:48:37.238Z',
          createdAt: '2020-04-18T09:48:37.238Z',
          members: [
            {
              id: 61,
              username: 'Psikoi',
              type: 'regular',
              lastImportedAt: '2020-04-18T02:22:49.364Z',
              registeredAt: '2020-04-10T18:11:02.544Z',
              updatedAt: '2020-04-18T04:02:42.235Z',
              role: 'member'
            },
            {
              id: 77,
              username: 'Zezima',
              type: 'regular',
              lastImportedAt: '2020-04-11T01:02:25.132Z',
              registeredAt: '2020-04-11T01:02:06.424Z',
              updatedAt: '2020-04-18T03:40:17.940Z',
              role: 'member'
            }
          ]
        }
      }
    ],
    errorResponses: [
      {
        description: 'If no name is given.',
        body: { message: 'Invalid group name.' }
      },
      {
        description: 'If name is already taken.',
        body: { message: "Group name 'Hexis' is already taken." }
      }
    ]
  },
  {
    title: 'Edit group',
    url: '/groups/:id',
    method: 'PUT',
    comments: [
      {
        type: 'error',
        content: 'If a list of members is supplied, it will replace any existing members list.'
      }
    ],
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    body: {
      name: 'Some new name',
      verificationCode: '842-225-748',
      members: ['Psikoi', 'Zezima']
    },
    successResponses: [
      {
        description: '',
        body: {
          id: 2,
          name: 'Some new name',
          createdAt: '2020-04-18T08:45:28.726Z',
          updatedAt: '2020-04-18T15:30:41.380Z',
          participants: [
            {
              id: 61,
              username: 'Psikoi',
              type: 'regular',
              lastImportedAt: '2020-04-18T02:22:49.364Z',
              registeredAt: '2020-04-10T18:11:02.544Z',
              updatedAt: '2020-04-18T04:02:42.235Z',
              role: 'member'
            },
            {
              id: 77,
              username: 'Zezima',
              type: 'regular',
              lastImportedAt: '2020-04-11T01:02:25.132Z',
              registeredAt: '2020-04-11T01:02:06.424Z',
              updatedAt: '2020-04-18T03:40:17.940Z',
              role: 'member'
            }
          ]
        }
      }
    ],
    errorResponses: [
      {
        description: 'If id is not given.',
        body: { message: 'Invalid group id.' }
      },
      {
        description: 'If the group of a specific id cannot be found.',
        body: { message: 'Group of id 4 was not found.' }
      },
      {
        description: 'If name or members are given.',
        body: { message: 'You must either include a new name or a new member list.' }
      },
      {
        description: 'If name is given but is already taken.',
        body: { message: "Group name 'Some taken name' is already taken." }
      },
      {
        description: 'If the verification code is not given.',
        body: { message: 'Invalid verification code.' }
      },
      {
        description: 'If the verification code is not correct.',
        body: { message: 'Incorrect verification code.' }
      }
    ]
  },
  {
    title: 'Delete group',
    url: '/groups/:id',
    method: 'DELETE',
    comments: [
      {
        type: 'error',
        content: 'This action is permanent: If a group is deleted, there is no way to restore it.'
      }
    ],
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    body: {
      verificationCode: '373-418-957'
    },
    successResponses: [
      {
        description: '',
        body: {
          message: "Successfully deleted group 'Hexis' (id: 56)"
        }
      }
    ],
    errorResponses: [
      {
        description: 'If id is not given.',
        body: { message: 'Invalid group id.' }
      },
      {
        description: 'If the group of a specific id cannot be found.',
        body: { message: 'Group of id 4 was not found.' }
      },
      {
        description: 'If the verification code is not given.',
        body: { message: 'Invalid verification code.' }
      },
      {
        description: 'If the verification code is not correct.',
        body: { message: 'Incorrect verification code.' }
      }
    ]
  },
  {
    title: 'Add members',
    url: '/groups/:id/add',
    method: 'POST',
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    body: {
      verificationCode: '373-418-957',
      members: ['Psikoi']
    },
    successResponses: [
      {
        description: '',
        body: {
          newMembers: [
            {
              id: 62,
              username: 'Zulu',
              type: 'regular',
              lastImportedAt: '2020-04-18T02:23:59.945Z',
              registeredAt: '2020-04-10T18:11:52.333Z',
              updatedAt: '2020-04-18T03:22:36.419Z',
              role: 'member'
            }
          ]
        }
      }
    ],
    errorResponses: [
      {
        description: 'If id is not given.',
        body: { message: 'Invalid group id.' }
      },
      {
        description: 'If members is invalid or empty.',
        body: { message: 'Invalid member list.' }
      },
      {
        description: 'If group of id could not be found.',
        body: { message: 'Group of id 56 was not found.' }
      },
      {
        description: 'If the verification code is not given.',
        body: { message: 'Invalid verification code.' }
      },
      {
        description: 'If the verification code is not correct.',
        body: { message: 'Incorrect verification code.' }
      },
      {
        description: 'If all the given players are already members.',
        body: { message: 'All players given are already members.' }
      }
    ]
  },
  {
    title: 'Remove members',
    url: '/groups/:id/remove',
    method: 'POST',
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    body: {
      verificationCode: '373-418-957',
      members: ['Psikoi']
    },
    successResponses: [
      {
        description: '',
        body: {
          message: 'Successfully removed 1 members from group of id: 3.'
        }
      }
    ],
    errorResponses: [
      {
        description: 'If id is not given.',
        body: { message: 'Invalid group id.' }
      },
      {
        description: 'If members is invalid or empty.',
        body: { message: 'Invalid members list' }
      },
      {
        description: 'If group of id could not be found.',
        body: { message: 'Group of id 56 was not found.' }
      },
      {
        description: 'If the verification code is not given.',
        body: { message: 'Invalid verification code.' }
      },
      {
        description: 'If the verification code is not correct.',
        body: { message: 'Incorrect verification code.' }
      },
      {
        description: 'If none of the members given exist.',
        body: { message: 'No valid tracked players were given.' }
      },
      {
        description: 'If none of the players given were members.',
        body: { message: 'None of the players given were members of that group.' }
      }
    ]
  },
  {
    title: 'Change member role',
    url: '/groups/:id/roles',
    method: 'PUT',
    params: [
      {
        field: 'id',
        type: 'integer',
        description: "The group's id."
      }
    ],
    body: {
      verificationCode: '291-226-419',
      username: 'Psikoi',
      role: 'leader'
    },
    successResponses: [
      {
        description: '',
        body: {
          player: {
            id: 61,
            username: 'Psikoi',
            type: 'regular',
            lastImportedAt: '2020-04-18T02:22:49.364Z',
            registeredAt: '2020-04-10T18:11:02.544Z',
            updatedAt: '2020-04-18T04:02:42.235Z',
            role: 'leader'
          },
          newRole: 'leader',
          oldRole: 'member'
        }
      }
    ],
    errorResponses: [
      {
        description: 'If id is not given.',
        body: { message: 'Invalid group id.' }
      },
      {
        description: 'If username is not given.',
        body: { message: 'Invalid username.' }
      },
      {
        description: 'If role is not given.',
        body: { message: 'Invalid group role.' }
      },
      {
        description: 'If group of id could not be found.',
        body: { message: 'Group of id 56 was not found.' }
      },
      {
        description: 'If the verification code is not given.',
        body: { message: 'Invalid verification code.' }
      },
      {
        description: 'If the verification code is not correct.',
        body: { message: 'Incorrect verification code.' }
      },
      {
        description: 'If player is not a member of the group.',
        body: { message: "'Psikoi' is not a member of Hexis." }
      },
      {
        description: 'If player already has the given role.',
        body: { message: "'Psikoi' already has the role of leader." }
      }
    ]
  }
];
