import AsyncStorage from '@react-native-async-storage/async-storage';
import { Paper } from './researchApi';

const HISTORY_KEY = '@research_history';
const FAVORITES_KEY = '@research_favorites';
const LISTS_KEY = '@research_lists';

export interface ResearchList {
  id: string;
  name: string;
  papers: Paper[];
}

export const getHistory = async (): Promise<Paper[]> => {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting history', e);
    return [];
  }
};

export const addToHistory = async (paper: Paper) => {
  try {
    const history = await getHistory();
    const updated = [paper, ...history.filter(p => p.paperId !== paper.paperId)].slice(0, 100);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error adding to history', e);
  }
};

export const getFavorites = async (): Promise<Paper[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting favorites', e);
    return [];
  }
};

export const toggleFavorite = async (paper: Paper) => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.find(p => p.paperId === paper.paperId);
    let updated;
    if (exists) {
      updated = favorites.filter(p => p.paperId !== paper.paperId);
    } else {
      updated = [paper, ...favorites];
    }
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    console.error('Error toggling favorite', e);
    return false;
  }
};

export const getReadingLists = async (): Promise<ResearchList[]> => {
  try {
    const data = await AsyncStorage.getItem(LISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting lists', e);
    return [];
  }
};

export const createList = async (name: string) => {
  try {
    const lists = await getReadingLists();
    const newList: ResearchList = { id: Date.now().toString(), name, papers: [] };
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify([...lists, newList]));
    return newList;
  } catch (e) {
    console.error('Error creating list', e);
    throw e;
  }
};

export const addPaperToList = async (listId: string, paper: Paper) => {
  try {
    const lists = await getReadingLists();
    const updated = lists.map(l => {
      if (l.id === listId) {
        if (!l.papers.find(p => p.paperId === paper.paperId)) {
          return { ...l, papers: [...l.papers, paper] };
        }
      }
      return l;
    });
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error adding paper to list', e);
  }
};
