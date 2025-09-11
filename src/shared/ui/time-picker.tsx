'use client'

import { useEffect, useMemo, useState } from 'react'

import { ChevronDownIcon } from 'lucide-react'
import { Label } from '@/shared/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import { Input } from '@/shared/ui/input'

type Props = {
  value: string 
  onChange: (value: string) => void
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toLocalParts(d: Date) {
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  }
}

export const TimePicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false)

  const [datePart, setDatePart] = useState<string>(() => value.split('T')[0] ?? '')
  const [timePart, setTimePart] = useState<string>(() => (value.split('T')[1] ?? '').slice(0, 5))

  useEffect(() => {
    const [d, t] = value.split('T')
    if (d && d !== datePart) setDatePart(d)
    const t5 = (t || '').slice(0, 5)
    if (t5 && t5 !== timePart) setTimePart(t5)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const selectedDate = useMemo(() => {
    const [y, m, d] = datePart.split('-').map(Number)
    if (!y || !m || !d) return new Date()
    return new Date(y, m - 1, d)
  }, [datePart])

  function apply(day?: Date) {
    if (day) {
      const p = toLocalParts(day)
      setDatePart(p.date)
      onChange(`${p.date}T${timePart}`)
    } else {
      onChange(`${datePart}T${timePart}`)
    }
    setOpen(false)
  }

  return (
    <div className='flex gap-4'>
      <div className='flex flex-col gap-3'>
        <Label htmlFor='date-picker' className='px-1'>
          Дата
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' id='date-picker' className='justify-between font-normal'>
              {datePart || 'Выбери дату'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={(day?: Date) => apply(day)}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='flex flex-col gap-3'>
        <Label htmlFor='time-picker' className='px-1'>
          Время
        </Label>
        <Input
          type='time'
          id='time-picker'
          step={300}
          value={timePart}
          onChange={(e) => setTimePart(e.target.value)}
          onBlur={() => onChange(`${datePart}T${timePart}`)}
          className='bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
        />
      </div>
      <input type='hidden' value={value} readOnly />
    </div>
  )
}

