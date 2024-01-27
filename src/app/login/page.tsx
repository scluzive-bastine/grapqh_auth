import PageHeader from "@/app/components/PageHeader"
import LoginForm from "@/app/components/login/LoginForm"

const page = () => {
  return (
    <div className='min-h-[calc(100vh-72px)] h-full relative flex flex-col justify-center'>
      <PageHeader title='Login' subheader='Hi, Welcome back 👋' />
      <LoginForm />
    </div>
  )
}

export default page
