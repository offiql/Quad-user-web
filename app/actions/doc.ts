'use server'

type FetchPdfResponse = {
  success: boolean
  data?: ArrayBuffer
  error?: string
}

export async function fetchPdf(url: string): Promise<FetchPdfResponse> {
  try {
    const response = await fetch(url, {
      // Using node-fetch on server side avoids CORS issues
      headers: {
        'Accept': 'application/pdf'
      },
      cache: 'no-store' // Disable caching
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`)
    }

    const pdfBuffer = await response.arrayBuffer()
    
    return {
      success: true,
      data: pdfBuffer
    }
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch PDF'
    }
  }
}

interface AddMemberResponse {
  success: boolean
  error?: string
}

export async function addTeamMember(email: string, access_token:string): Promise<AddMemberResponse> {
  try {
    const response = await fetch('https://api.example.com/v1/team/members', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error('Failed to add team member')
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Something went wrong' 
    }
  }
}
