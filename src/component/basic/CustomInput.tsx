import SearchRounded from '@mui/icons-material/SearchRounded'

import { Box, Input, InputProps } from '@mui/joy'
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react'

export const SearchInput = (props: InputProps) => (
  <Input {...props} variant="soft" startDecorator={<SearchRounded />} />
)

interface Tuple2InputProps extends Omit<InputProps, 'onChange' | 'value'> {
  readonly value: [number, number]
  onChange: (value: [number, number]) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}
export const Tuple2Input = memo(
  forwardRef<HTMLElement, Tuple2InputProps>(
    ({ value, onChange, onBlur, sx, size }: Tuple2InputProps, ref: React.Ref<HTMLElement>) => {
      const [v1, setV1] = useState('')
      const [v2, setV2] = useState('')
      const onChangeRef = useRef<(value: [number, number]) => void>()

      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'v1') {
          setV1(value)
        } else {
          setV2(value)
        }
      }, [])

      useEffect(() => {
        setV1(value[0].toString())
        setV2(value[1].toString())
      }, [value])
      useEffect(() => {
        onChangeRef.current = onChange
      }, [onChange])

      useEffect(() => {
        if (v1 !== '' && v2 !== '') {
          onChangeRef.current?.([Number(v1), Number(v2)])
        }
      }, [v1, v2])

      return (
        <Box
          sx={{
            ...sx,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1,
          }}
          ref={ref}
        >
          <Input
            name="v1"
            type="number"
            value={v1}
            onChange={handleChange}
            onBlur={onBlur}
            size={size}
          />
          <Input
            name="v2"
            type="number"
            value={v2}
            onChange={handleChange}
            onBlur={onBlur}
            size={size}
          />
        </Box>
      )
    },
  ),
)
