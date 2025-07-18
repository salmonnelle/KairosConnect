import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { eventSchema, EVENT_TAGS, EVENT_TYPES, EVENT_TOPICS } from '@/lib/schema/event'
import { suggestTags, suggestEventType, suggestEventTopic } from '@/lib/utils/event-utils'

// Form schema based on our event schema
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.enum(EVENT_TYPES),
  topic: z.enum(EVENT_TOPICS),
  date: z.date({
    required_error: "Please select a date",
  }),
  tags: z.array(z.enum(EVENT_TAGS)),
  isFeatured: z.boolean().default(false)
})

type FormValues = z.infer<typeof formSchema>

interface EventFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<FormValues>
}

export function EventForm({ onSuccess, onCancel, initialData }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || [])
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      location: initialData?.location || '',
      type: initialData?.type || 'Other',
      topic: initialData?.topic || 'Other',
      date: initialData?.date || new Date(),
      tags: initialData?.tags || [],
      isFeatured: initialData?.isFeatured || false
    }
  })
  
  // Watch title and description to suggest tags
  const title = form.watch('title')
  const description = form.watch('description')
  
  // Suggest tags, type, and topic when title or description changes
  useEffect(() => {
    if (title && description) {
      const suggested = suggestTags(title, description)
      setSuggestedTags(suggested.filter(tag => !selectedTags.includes(tag)))
      
      // Only auto-suggest type and topic if not already set
      if (!initialData?.type) {
        const suggestedType = suggestEventType(title, description)
        form.setValue('type', suggestedType as any)
      }
      
      if (!initialData?.topic) {
        const suggestedTopic = suggestEventTopic(title, description)
        form.setValue('topic', suggestedTopic as any)
      }
    }
  }, [title, description, form, initialData?.type, initialData?.topic, selectedTags])
  
  // Load available tags from the database
  useEffect(() => {
    const loadTags = async () => {
      const { data, error } = await supabase
        .from('event_tags')
        .select('name')
        .order('name')
      
      if (!error && data) {
        setAvailableTags(data.map(tag => tag.name))
      } else {
        // Fallback to our predefined tags if database query fails
        setAvailableTags(EVENT_TAGS)
      }
    }
    
    loadTags()
  }, [])
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
      
      form.setValue('tags', newTags as any)
      return newTags
    })
  }
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    
    try {
      // Format date as ISO string for database
      const formattedData = {
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
      }
      
      // Insert into Supabase
      const { error } = await supabase
        .from('events')
        .insert([{
          title: formattedData.title,
          description: formattedData.description,
          location: formattedData.location,
          type: formattedData.type,
          topic: formattedData.topic,
          date: formattedData.date,
          tags: formattedData.tags,
          is_featured: formattedData.isFeatured
        }])
      
      if (error) {
        console.error('Error saving event:', error)
        alert('Failed to save event. Please try again.')
      } else {
        if (onSuccess) onSuccess()
      }
    } catch (error) {
      console.error('Error in form submission:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Event Title *
          </label>
          <Input
            id="title"
            placeholder="Enter event title"
            {...form.register('title')}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <Textarea
            id="description"
            placeholder="Enter event description"
            rows={4}
            {...form.register('description')}
            disabled={isLoading}
          />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location *
            </label>
            <Input
              id="location"
              placeholder="Enter event location"
              {...form.register('location')}
              disabled={isLoading}
            />
            {form.formState.errors.location && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('date') ? (
                    format(form.watch('date'), 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('date')}
                  onSelect={(date) => date && form.setValue('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Event Type *
            </label>
            <Select
              onValueChange={(value) => form.setValue('type', value as any)}
              defaultValue={form.watch('type')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-1">
              Event Topic *
            </label>
            <Select
              onValueChange={(value) => form.setValue('topic', value as any)}
              defaultValue={form.watch('topic')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event topic" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TOPICS.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.topic && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.topic.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  className="ml-2 text-primary hover:text-primary/70"
                  onClick={() => handleTagToggle(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {suggestedTags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="bg-secondary/50 hover:bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                    onClick={() => handleTagToggle(tag)}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm cursor-pointer"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {form.formState.errors.tags && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.tags.message as string}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={form.watch('isFeatured')}
            onCheckedChange={(checked) => form.setValue('isFeatured', !!checked)}
            disabled={isLoading}
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Feature this event
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Event
        </Button>
      </div>
    </form>
  )
}
