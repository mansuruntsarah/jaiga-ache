import { handleSearchLogic } from '../models/searchLogic';

export const handleSearch = async (searchQuery) => {
    const result = await handleSearchLogic(searchQuery);
    return result;
};