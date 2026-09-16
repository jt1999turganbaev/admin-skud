import { Pagination as MantinePagination } from '@mantine/core'

interface PaginationProps {
  page: number
  lastPage: number
  onChange: (page: number) => void
}

export const Pagination = ({ page, lastPage, onChange }: PaginationProps) => {
  if (lastPage <= 1) return null

  return (
    <MantinePagination
      value={page}
      total={lastPage}
      onChange={onChange}
      size="sm"
      radius="sm"
      withEdges={lastPage > 7}
      getItemProps={(item) => ({ 'aria-label': `${item}-sahifa` })}
    />
  )
}
