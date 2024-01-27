interface PageHeaderProps {
  title: string
  subheader?: string
}
const PageHeader = ({ title, subheader }: PageHeaderProps) => {
  return (
    <div className='flex space-x-10 items-center dark:border-gray-800 pb-4 max-w-lg mx-auto w-full justify-center'>
      <div className='text-center'>
        <h2 className='text-gray-800 dark:text-white text-xl md:text-4xl font-semibold'>{title}</h2>
        <p className='text-gray-500 text-sm mt-1'>{subheader}</p>
      </div>
    </div>
  )
}

export default PageHeader
