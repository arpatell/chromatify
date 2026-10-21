// Source: https://ragnarok-reader.vercel.app/ public support configuration.
// Verified 2026-10-21. Keep network labels and addresses paired exactly.
export const KOFI_URL = 'https://ko-fi.com/arpatell';

const EVM_ADDRESS = '0x0b41B491E96cc626E009BAdDA83d535A94Ab4a85';

export const SUPPORT_WALLETS = [
  { id: 'sol', label: 'SOL', network: 'Solana', address: '8Vs3NX3pN7M7CjmgM6tENgef1LfJLHkWLn6SK3oPEX9r' },
  { id: 'eth', label: 'ETH', network: 'Ethereum', address: EVM_ADDRESS },
  { id: 'btc', label: 'BTC', network: 'Bitcoin', address: 'bc1p2l627u3gwyj55pnpn4pkrehvvrlwm6y74cnx006ztdnkut6vhtns0fy2c8' },
  { id: 'base', label: 'BASE', network: 'Base', address: EVM_ADDRESS },
  { id: 'monad', label: 'MONAD', network: 'Monad', address: EVM_ADDRESS },
  { id: 'sui', label: 'SUI', network: 'Sui', address: '0xbe1bb13a1bbe47a5948c9c190d32dc70984fffd43fc128428fe67ac3dc11c4ba' },
  { id: 'polygon', label: 'POLYGON', network: 'Polygon', address: EVM_ADDRESS },
];
