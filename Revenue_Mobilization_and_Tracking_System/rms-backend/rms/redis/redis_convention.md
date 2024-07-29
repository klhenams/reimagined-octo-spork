# Convention

## Buildings

Buildings are going to populate the cache store as clustered buildings under an mmda.

Buildings under an MMDA
`MMDA:buildings` - all buildings under the mmda
`MMDA:buildings:building<ID>` - for one building in the document
`MMDA:building:building<ID>:businesses` - all businesses under a building in an MMDA

## Businesses

Businesses are also going to be clustered under an mmda under a building but would be separate from buildings.

`MMAD:building:business<ID>` - for a business in a building in an MMDA

## Users

Cache user data in an mmda

`MMDA:users` - people in an mmda being tracked.
`MMDA:user<ID>` - information about one specific user.
