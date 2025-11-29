export const calculatePagination = (
  page: number = 1,
  limit: number = 10
): { skip: number; limit: number } => {
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), 100); // Max 100 items per page
  
  return {
    skip: (pageNum - 1) * limitNum,
    limit: limitNum
  };
};

