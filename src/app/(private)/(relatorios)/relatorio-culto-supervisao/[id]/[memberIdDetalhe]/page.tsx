'use client';
import MemberDetails from '@/components/member-details';
import MemberDetailsSkeleton from '@/components/member-details-skeleton';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { Fragment, Suspense } from 'react';

export default function page() {
  const searchParams = useSearchParams();

  const member_id = searchParams.get('memberIdDetalhe');
  const URL_User = `/users/${member_id}`;

  const { data: session, status } = useSession();
  const token = session?.user?.token as string;

  const axiosAuth = useAxiosAuth(token);

  const getMember = async () => {
    const { data } = await axiosAuth.get(URL_User);
    return data;
  };

  const {
    data: member,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['detailsMember'],
    queryFn: getMember,
  });
  return (
    <Fragment>
      <div>
        {isLoading ? (
          <MemberDetailsSkeleton />
        ) : (
          <MemberDetails member={member} />
        )}
      </div>
    </Fragment>
  );
}
