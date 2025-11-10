// hooks/useSearchOperations.ts
import { useCallback } from 'react';
import { useSearch } from '@/components/context/SearchContext';
import { searchProducts } from '@/app/actions/search.actions';
import { useRouter } from 'next/navigation';

export function useSearchOperations() {
  const { state, dispatch } = useSearch();
  const router = useRouter();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      dispatch({ type: 'SET_RESULTS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_QUERY', payload: query });

    try {
      const result = await searchProducts(query);
      
      if (result.success) {
        dispatch({ type: 'SET_RESULTS', payload: result.products || [] });
      } else {
        dispatch({ type: 'SET_RESULTS', payload: [] });
      }
    } catch (error) {
      console.error('Search failed:', error);
      dispatch({ type: 'SET_RESULTS', payload: [] });
    }
  }, [dispatch]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (state.query.trim()) {
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: state.query.trim() });
      router.push(`/shop?search=${encodeURIComponent(state.query.trim())}`);
      dispatch({ type: 'SET_OPEN', payload: false });
      dispatch({ type: 'SET_QUERY', payload: '' });
    }
  }, [state.query, router, dispatch]);

  const quickSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: query });
    router.push(`${query}`);
    dispatch({ type: 'SET_OPEN', payload: false });
  }, [router, dispatch]);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_QUERY', payload: '' });
    dispatch({ type: 'SET_RESULTS', payload: [] });
  }, [dispatch]);

  const openSearch = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: true });
  }, [dispatch]);

  const closeSearch = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: false });
    dispatch({ type: 'SET_QUERY', payload: '' });
    dispatch({ type: 'SET_RESULTS', payload: [] });
  }, [dispatch]);

  return {
    query: state.query,
    results: state.results,
    isLoading: state.isLoading,
    isOpen: state.isOpen,
    recentSearches: state.recentSearches,
    performSearch,
    handleSearchSubmit,
    quickSearch,
    clearSearch,
    openSearch,
    closeSearch,
    setQuery: (query: string) => dispatch({ type: 'SET_QUERY', payload: query })
  };
}