import React from 'react'
import { getCurrentUserData } from '@/modules/auth/actions';
import { getAllProblems } from '@/modules/problems/actions';
import ProblemsTable from '@/modules/problems/components/problems-table';

const ProblemsPage = async () => {
  const user = await getCurrentUserData();
  const result = await getAllProblems();
  
  if (!result.success) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-destructive'>Error loading problems: {result.error}</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-32'>
      <ProblemsTable problems={result.data} user={user}/>
    </div>
  )
}

export default ProblemsPage
