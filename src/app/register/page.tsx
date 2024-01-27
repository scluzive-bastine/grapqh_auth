import PageHeader from "@/app/components/PageHeader"
import RegisterForm from "@/app/components/register/RegisterForm"

const page = () => {
  return (
    <div className='min-h-[calc(100vh-72px)] h-full relative flex flex-col justify-center'>
      <PageHeader title='Register' subheader='Welcome create your account 🙌' />
      <RegisterForm />
    </div>
  )
}

export default page
