import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CardType = 'CLASSIC' | 'GOLD' | 'PLATINUM';

export interface Card {
    id: string;
    number: string; // Masked for security in store, usually
    holder: string;
    type: CardType;
    balance: number;
    limit: number;
    currency: string;
    expiry: string;
    isFrozen: boolean;
    onlinePayments: boolean;
    atmWithdrawals: boolean;
}

interface CardsState {
    cards: Card[];
    toggleFreeze: (cardId: string) => void;
    toggleOnline: (cardId: string) => void;
    toggleAtm: (cardId: string) => void;
    setLimit: (cardId: string, limit: number) => void;
    getCard: (cardId: string) => Card | undefined;
}

const INITIAL_CARDS: Card[] = [
    {
        id: 'card-1',
        number: '4532 **** **** 9012',
        holder: 'ADMIN USER',
        type: 'PLATINUM',
        balance: 450000,
        limit: 5000000,
        currency: 'XAF',
        expiry: '12/28',
        isFrozen: false,
        onlinePayments: true,
        atmWithdrawals: true
    },
    {
        id: 'card-2',
        number: '4123 **** **** 4567',
        holder: 'ADMIN USER',
        type: 'CLASSIC',
        balance: 25000,
        limit: 1000000,
        currency: 'XAF',
        expiry: '09/27',
        isFrozen: false,
        onlinePayments: false,
        atmWithdrawals: true
    }
];

export const useCardsStore = create<CardsState>()(
    persist(
        (set, get) => ({
            cards: INITIAL_CARDS,

            toggleFreeze: (cardId) => set((state) => ({
                cards: state.cards.map(c =>
                    c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c
                )
            })),

            toggleOnline: (cardId) => set((state) => ({
                cards: state.cards.map(c =>
                    c.id === cardId ? { ...c, onlinePayments: !c.onlinePayments } : c
                )
            })),

            toggleAtm: (cardId) => set((state) => ({
                cards: state.cards.map(c =>
                    c.id === cardId ? { ...c, atmWithdrawals: !c.atmWithdrawals } : c
                )
            })),

            setLimit: (cardId, limit) => set((state) => ({
                cards: state.cards.map(c =>
                    c.id === cardId ? { ...c, limit } : c
                )
            })),

            getCard: (cardId) => get().cards.find(c => c.id === cardId)
        }),
        {
            name: 'sgbge-cards-store'
        }
    )
);
