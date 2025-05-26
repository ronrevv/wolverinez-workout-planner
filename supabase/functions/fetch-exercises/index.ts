
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { muscleGroup } = await req.json()
    console.log('Fetching exercises for muscle group:', muscleGroup)

    // Using a free fitness API to fetch exercises
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscleGroup}`, {
      headers: {
        'X-Api-Key': 'YOUR_API_NINJAS_KEY', // You can get this free from API Ninjas
      }
    })

    if (!response.ok) {
      // Fallback to predefined exercise data if API fails
      const fallbackExercises = getFallbackExercises(muscleGroup)
      return new Response(
        JSON.stringify({ exercises: fallbackExercises }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const exercises = await response.json()
    
    // Transform the data to match our expected format
    const transformedExercises = exercises.map((exercise: any, index: number) => ({
      id: `${muscleGroup}_${index + 1}`,
      name: exercise.name,
      equipment: exercise.equipment || 'bodyweight',
      description: exercise.instructions || 'No description available',
      difficulty: exercise.difficulty || 'beginner',
      muscleGroup: muscleGroup,
      type: exercise.type || 'strength'
    }))

    return new Response(
      JSON.stringify({ exercises: transformedExercises }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching exercises:', error)
    
    // Return fallback exercises on error
    const { muscleGroup } = await req.json().catch(() => ({ muscleGroup: 'chest' }))
    const fallbackExercises = getFallbackExercises(muscleGroup)
    
    return new Response(
      JSON.stringify({ exercises: fallbackExercises }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getFallbackExercises(muscleGroup: string) {
  const exerciseDatabase: { [key: string]: any[] } = {
    chest: [
      { id: 'chest_1', name: 'Push-ups', equipment: 'bodyweight', description: 'Standard push-up exercise', difficulty: 'beginner' },
      { id: 'chest_2', name: 'Bench Press', equipment: 'barbell', description: 'Barbell bench press', difficulty: 'intermediate' },
      { id: 'chest_3', name: 'Chest Fly', equipment: 'dumbbells', description: 'Dumbbell chest fly', difficulty: 'beginner' }
    ],
    back: [
      { id: 'back_1', name: 'Pull-ups', equipment: 'bodyweight', description: 'Standard pull-up exercise', difficulty: 'intermediate' },
      { id: 'back_2', name: 'Bent Over Row', equipment: 'barbell', description: 'Barbell bent over row', difficulty: 'intermediate' },
      { id: 'back_3', name: 'Lat Pulldown', equipment: 'cable', description: 'Cable lat pulldown', difficulty: 'beginner' }
    ],
    legs: [
      { id: 'legs_1', name: 'Squats', equipment: 'bodyweight', description: 'Bodyweight squats', difficulty: 'beginner' },
      { id: 'legs_2', name: 'Lunges', equipment: 'bodyweight', description: 'Forward lunges', difficulty: 'beginner' },
      { id: 'legs_3', name: 'Deadlifts', equipment: 'barbell', description: 'Romanian deadlifts', difficulty: 'advanced' }
    ],
    shoulders: [
      { id: 'shoulders_1', name: 'Shoulder Press', equipment: 'dumbbells', description: 'Dumbbell shoulder press', difficulty: 'intermediate' },
      { id: 'shoulders_2', name: 'Lateral Raises', equipment: 'dumbbells', description: 'Dumbbell lateral raises', difficulty: 'beginner' },
      { id: 'shoulders_3', name: 'Pike Push-ups', equipment: 'bodyweight', description: 'Pike position push-ups', difficulty: 'intermediate' }
    ],
    arms: [
      { id: 'arms_1', name: 'Bicep Curls', equipment: 'dumbbells', description: 'Standard bicep curls', difficulty: 'beginner' },
      { id: 'arms_2', name: 'Tricep Dips', equipment: 'bodyweight', description: 'Bodyweight tricep dips', difficulty: 'intermediate' },
      { id: 'arms_3', name: 'Hammer Curls', equipment: 'dumbbells', description: 'Hammer grip curls', difficulty: 'beginner' }
    ],
    core: [
      { id: 'core_1', name: 'Plank', equipment: 'bodyweight', description: 'Standard plank hold', difficulty: 'beginner' },
      { id: 'core_2', name: 'Crunches', equipment: 'bodyweight', description: 'Basic crunches', difficulty: 'beginner' },
      { id: 'core_3', name: 'Russian Twists', equipment: 'bodyweight', description: 'Seated Russian twists', difficulty: 'intermediate' }
    ]
  }

  return exerciseDatabase[muscleGroup.toLowerCase()] || exerciseDatabase.chest
}
