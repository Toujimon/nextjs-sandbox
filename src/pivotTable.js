import crossfilter from 'crossfilter2'

/* TODO: Modify code to have similar functionality */

function formatNumber(number: number): string {
  return (Math.round(number * 100) / 100).toLocaleString()
}

/**
 * Function that ensures that an unique instance for an specific object/array
 * exists as a given time.
 * It will stringify the provided element and use it as a key for the map, so
 * only an instance will be for two identical serializable elements even if
 * they don't have referential equality.
 *
 * E.g:
 * ```
 * const itemsMap = new Map()
 * const itemA = {a: 1}
 * const outputA = getOrCreateInstance(itemA, itemsMap)
 * // outputA === itemA
 *
 * const itemB = {a: 1}
 * // identical to itemA, but not same instance: itemB !== itemA
 * const outputB = getOrCreateInstance(itemB, itemsMap)
 * // outputB !== itemB
 * // outputB === outputA === itemA
 * ```
 *
 * @param item
 * @param map
 */
function getOrCreateInstance<T>(item: T, map: Map<string, T>): T {
  const key = JSON.stringify(item)
  const instance = map.get(key)
  if (!instance) {
    map.set(key, item)
    return item
  }
  return instance
}

/**
 * Returns a collection of sorted values of a dimension (rows/columns) so the table
 * can be built.
 * This collection includes first the key of the dimension inside the map and then the value of the dimension.
 * 
 * They are sorted so all that have the same value at one position are together
   * Original = {
       1: ["market2", "us"]
   *   2: ["market1", "us"]
   *   3: ["market1", "spain"]
   *   4: ["market2", "spain"]
   * }
   * ----
   * Sorted = [
   *   ["market1", "spain"]],
   *   ["market1", "us"]],
   *   ["market2", "spain"]],
       ["market2", "us"]]
   * ]
   */
function getSortedDimensionArray(dimensionMap: Map<string, DimensionType>) {
  const dimensionValuesArray = Array.from(dimensionMap.values())
  if (dimensionValuesArray.length) {
    const firstDimensionValue = dimensionValuesArray[0]
    const dimensionValueSorters = firstDimensionValue.map((x) => {
      if (typeof x === 'string') {
        return (a, b) => a.localeCompare(b)
      }
      return (a, b) => a - b
    })
    dimensionValuesArray.sort((aRow, bRow) => {
      for (let i = 0; i < dimensionValueSorters.length; i += 1) {
        const comparison = dimensionValueSorters[i](aRow[i], bRow[i])
        if (comparison !== 0) {
          return comparison
        }
      }
      return 0
    })
  }
  return dimensionValuesArray
}

/**
 * High order function that returns the function to get the array of values
 * to group an item using the fields provided. These fields are
 * usually the defined "rows" or "columns"
 *
 * If no fields are passed, that means that they are all to be grouped together.
 *
 * E.g:
 * ```
 * // With fields
 * fields = [{accessor: 'shape'}, {accessor: 'color'}]
 *
 * ({ shape: "triangle", color: "red", area: 4 }) => ["triangle", "red"]
 * ({ shape: "circle", color: "red", area: 2 }) => ["circle", "red"]
 * ({ shape: "square", color: "blue", area: 45 }) => ["square", "blue"]
 * ({ shape: "triangle", color: "red", area: 25.8 }) => ["triangle", "red"]
 *
 * // Without fields
 * fields = []
 *
 * ({ shape: "triangle", color: "red", area: 4 }) => ["all"]
 * ({ shape: "circle", color: "red", area: 2 }) => ["all"]
 * ({ shape: "square", color: "blue", area: 45 }) => ["all"]
 * ({ shape: "triangle", color: "red", area: 25.8 }) => ["all"]
 * ```
 *
 * @param fields
 */
function createDimensionGetter(
  fields: Array<{ accessor: string | number | symbol }>,
): (item: object) => Array<string | number> {
  return fields.length
    ? (item) => fields.map(({ accessor }) => item[accessor])
    : () => ['all']
}

export interface Field {
  /**
   * If the field is used as a "row", the header of its column will display
   * this text. It won't have any effect if used as a "column".
   */
  header?: string
  /**
   * Accessor to get its grouping value from an item (as "item[accessor]").
   */
  accessor: string | number | symbol
  /**
   * Function to apply to the different values of this field found when
   * it has to be displayed on the table. Specially usefull for date formatting
   * or other special values (like days of the week).
   */
  format?: (value: any) => string
}

type DimensionType = Array<string | number>

/**
 * Returns the data to display a pivoted table with the data
 * grouped by rows and columns.
 * @param data
 * @param rows
 * @param columns
 * @param options
 */
export default function createPivotTableData(
  data: Array<object>,
  rows: Array<Field>,
  columns: Array<Field>,
  options: {
    reduceGroupedData?: (
      groupedData: crossfilter.Group<object, any, any>,
    ) => crossfilter.Group<object, any, any>
    getGroupedValue?: (dataItem: any) => number
    formatCellValue?: (cellValue: number) => string
  } = {},
) {
  const {
    reduceGroupedData,
    getGroupedValue,
    formatCellValue = formatNumber,
  } = options

  /*
   * Grouping all the entries matching row/column values isn't
   * trivial, so crossfilter is used to assist in the matter.
   */
  const cfData = crossfilter<object>(data)

  /*
   * Some helper functions are prepared to get the proper value
   * to identify the cell (combination of row and column) an specific item must
   * be grouped into.
   *
   * Each cell will be calculated from a group of entries, and the identifier of
   * the group will be a array of the unique values for rows/columns:
   *
   * e.g:
   * ```
   * // - rows: market
   * // - columns: country, city
   * ["market1", "spain", "madrid"] => [{country: "spain", city: "madrid", market: "market1", ....}, ...]
   * ["market1", "us", "chicago"] => [{country: "us", city: "madrid", market: "market1", ....}, ...]
   * ["market2", "us", "chicago"] => [{country: "us", city: "chicago", market: "market2", ....}, ...]
   * ["market1", "spain", "toledo"] => [{country: "spain", city: "toledo", market: "market1", ....}, ...]
   * // ...
   * ```
   */
  const getRowDimension = createDimensionGetter(rows)
  const getColumnDimension = createDimensionGetter(columns)

  const cfDataByRowAndColumn = cfData
    .dimension((item) => [
      ...getRowDimension(item),
      ...getColumnDimension(item),
    ])
    .group<any, any>()

  // The data for each cell is reduced using provided options or just getting the count by defaul
  const dataGroupedByCell = (reduceGroupedData
    ? reduceGroupedData(cfDataByRowAndColumn)
    : cfDataByRowAndColumn
  ).all()

  /* Now we have the data grouped by cells, but still don't know the rows and columns, which also
  need to be ordered.
  */
  const rowsMap = new Map<string, DimensionType>()
  const columnsMap = new Map<string, DimensionType>()
  /* To ease the access to the data for each cell, a matrix is built so each value cal be accessed
      via "matrix[row][column]" using the row and column instances (because their order cannot be inferred
        right now) */
  const cellsMatrix = new Map<DimensionType, Map<DimensionType, string>>()

  const rowsDefinitionLength = rows.length || 1

  /* helpers functions to get the subset of the grouping key that defines to
  which unique row and column a cell belongs to. The combination of both was
  earlier used to group entries by cell. */
  const getRowsFromGroupingKey = (groupingKey: DimensionType): DimensionType =>
    groupingKey.slice(0, rowsDefinitionLength)
  const getColumnsFromKey = (groupingKey: DimensionType): DimensionType =>
    groupingKey.slice(rowsDefinitionLength)

  dataGroupedByCell.forEach(
    ({ key, value }: { key: DimensionType; value: any }) => {
      const row = getOrCreateInstance(getRowsFromGroupingKey(key), rowsMap)
      const column = getOrCreateInstance(getColumnsFromKey(key), columnsMap)

      const rowCells = cellsMatrix.get(row) ?? new Map<Array<string>, string>()

      /* For a specific cell in the matrix, the value is prepared for the final
      process when the ordered table data is returned */
      rowCells.set(
        column,
        formatCellValue(getGroupedValue ? getGroupedValue(value) : value),
      )

      cellsMatrix.set(row, rowCells)
    },
  )

  const sortedRows = getSortedDimensionArray(rowsMap)
  const sortedColumns = getSortedDimensionArray(columnsMap)

  const tableColumns: Array<{
    header: Array<string>
    getCellValue: (row: DimensionType) => string
  }> = [
    /* The columns of the table always have to include one column per each
    "row" field defined, and it goes before the calculated columns */
    ...rows.map(({ header, format, accessor }, index) => ({
      header: [
        header ?? typeof accessor !== 'symbol' ? accessor.toString() : '',
      ],
      getCellValue: (row: DimensionType) => {
        const rowValue = row[index]
        if (rowValue === undefined) {
          return ''
        }
        return (format?.(rowValue) ?? rowValue).toString()
      },
    })),
    ...sortedColumns.map((column) => {
      const header =
        column[0] === 'all'
          ? ['Value']
          : column.map((columnValue, index) => {
              const { format } = columns[index]
              return (format ? format(columnValue) : columnValue).toString()
            })
      return {
        header,
        getCellValue: (row: DimensionType) => {
          return cellsMatrix.get(row)?.get(column) ?? ''
        },
      }
    }),
  ]

  /* Finally the values are returned as "header" and "items":
    eg:
    - headers: 
      [["market"],["spain", "madrid"], ["spain", "toledo"], ["us", "chicago"]]
    - items:
      ["market1", "0.45", "2345.89", "56"]
      ["market2", "", "", "56"]
  */
  return {
    headers: tableColumns.map(({ header }) => header),
    items: sortedRows.map((row) =>
      tableColumns.map(({ getCellValue: getValue }) => getValue(row)),
    ),
  }
}
