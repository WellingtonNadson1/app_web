'use client';

import type React from 'react';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Mail,
  Phone,
  School,
  Users,
  BookOpen,
  Award,
  Heart,
  Home,
  UserCheck,
  Info,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Member } from './schema';
import { useSession } from 'next-auth/react';
import useAxiosAuth from '@/lib/hooks/useAxiosAuth';
import { useQuery } from '@tanstack/react-query';

// Skeleton component for the dialog content
function MemberDetailsDialogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header with avatar skeleton */}
      <div className="flex flex-col items-center text-center pb-2">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-5 w-24 mt-1" />
      </div>

      {/* Contact info skeleton */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div>
        <Skeleton className="h-10 w-full mb-6" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Member details content component
function MemberDetailsContent({ member }: { member: Member }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  const discipulador = member?.discipulador.map(
    (d) =>
      d.user_discipulador.first_name ??
      d.user_discipulador.first_name ??
      'Nome não informado',
  );

  const discipulos = member?.discipulos.map(
    (d) =>
      d.user_discipulos.first_name ??
      d.user_discipulos.first_name ??
      'Nome não informado',
  );

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
      {/* Header with avatar */}
      <div className="flex flex-col items-center text-center pb-2">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage
            src={member.image_url}
            alt={`${member.first_name} ${member.last_name}`}
          />
          <AvatarFallback className="text-2xl">
            {getInitials(member.first_name, member.last_name)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">
          {member.first_name} {member.last_name}
        </h2>
        <Badge className="mt-1">{member.role}</Badge>
      </div>

      {/* Quick contact info */}
      <div className="flex justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{member.telefone}</span>
        </div>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="church">Igreja</TabsTrigger>
          <TabsTrigger value="discipleship">Discipulado</TabsTrigger>
          <TabsTrigger value="leadership">Liderança</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Nome Completo
                  </p>
                  <p>
                    {member.first_name} {member.last_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Nascimento
                  </p>
                  <p>{formatDate(member.date_nascimento)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Sexo
                  </p>
                  <p>{member.sexo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Estado Civil
                  </p>
                  {member.estado_civil ? (
                    <p>{member.estado_civil}</p>
                  ) : (
                    <p>Não informado</p>
                  )}
                </div>
                {member.nome_conjuge && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Cônjuge
                    </p>
                    <p>{member.nome_conjuge}</p>
                  </div>
                )}
                {member.date_casamento && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Data de Casamento
                    </p>
                    <p>{formatDate(member.date_casamento)}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Filhos
                  </p>
                  <p>
                    {member.has_filho
                      ? `Sim (${member.quantidade_de_filho || 'quantidade não informada'})`
                      : 'Não'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Contato e Endereço</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{member.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </p>
                    {member.telefone ? (
                      <p>{member.telefone}</p>
                    ) : (
                      <p>(00) 00000-0000</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Cidade/Estado
                    </p>
                    <p>
                      {member.cidade && member.estado
                        ? `${member.cidade}/${member.estado}`
                        : 'Não informado'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Endereço
                    </p>
                    <p>
                      {member.endereco && member.numero_casa
                        ? `${member.endereco}, ${member.numero_casa}`
                        : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Profissional</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Escolaridade
                    </p>
                    <p>{member.escolaridade}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Profissão
                    </p>
                    <p>{member.profissao || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Church Information Tab */}
        <TabsContent value="church" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações na Igreja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Supervisão
                  </p>
                  <p>{member.supervisao_pertence?.nome || 'Não informado'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Célula
                  </p>
                  <p>{member.celula?.nome || 'Não informado'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Batizado
                  </p>
                  <p>{member.batizado ? 'Sim' : 'Não'}</p>
                </div>
                {member.batizado && member.date_batizado && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Data do Batismo
                    </p>
                    <p>{formatDate(member.date_batizado)}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Decisão
                  </p>
                  <p>
                    {member.date_decisao
                      ? formatDate(member.date_decisao)
                      : 'Não informado'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Situação no Reino
                  </p>
                  <p>{member.situacao_no_reino?.nome || 'Não informado'}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Escolas e Encontros
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                      <School className="h-4 w-4" />
                      Escolas
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.escolas && member.escolas.length > 0 ? (
                        member.escolas.map((escola, index) => (
                          <Badge key={index} variant="secondary">
                            {escola.nome}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhuma escola concluída
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                      <Heart className="h-4 w-4" />
                      Encontros
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.encontros && member.encontros.length > 0 ? (
                        member.encontros.map((encontro, index) => (
                          <Badge key={index} variant="secondary">
                            {encontro.nome}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum encontro realizado
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discipleship Tab */}
        <TabsContent value="discipleship" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Relacionamentos de Discipulado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  Discipulador
                </h4>
                <div className="pl-6">
                  {discipulador.length > 0 ? (
                    discipulador.map((nome, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {nome.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{nome}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Não possui discipulador
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Discípulos:{' '}
                  <Badge>{discipulos ? discipulos.length : '0'}</Badge>
                </h4>
                <div className="pl-6">
                  {discipulos.length > 0 ? (
                    discipulos.map((nome, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {nome.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{nome}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Não possui discípulos
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Status de discipulado:{' '}
                  <span className="font-medium">
                    {member.is_discipulado ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leadership Tab */}
        <TabsContent value="leadership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Informações de Liderança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Cargo de Liderança
                </p>
                <p>
                  {member.cargo_de_lideranca?.nome ||
                    'Não possui cargo de liderança'}
                </p>
              </div>

              {member?.celula_lidera && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    Célula que Lidera
                  </h4>
                  <div className="pl-6">
                    <Badge variant="secondary">
                      {member?.celula_lidera.nome
                        ? member?.celula_lidera.nome
                        : 'Não lidera célula'}
                    </Badge>
                  </div>
                </div>
              )}

              {member.escola_lidera && member.escola_lidera.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    Escolas que Lidera
                  </h4>
                  <div className="pl-6 flex flex-wrap gap-2">
                    {member.escola_lidera.map((escola, index) => (
                      <Badge key={index} variant="secondary">
                        {escola}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {member.supervisoes_lidera &&
                member.supervisoes_lidera.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Supervisões que Lidera
                    </h4>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {member.supervisoes_lidera.map((supervisao, index) => (
                        <Badge key={index} variant="secondary">
                          {supervisao}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Presenças</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Presenças em Cultos
                    </p>
                    <p className="text-sm">
                      Total:{' '}
                      <span className="font-medium">
                        {member.presencas_cultos?.length || 0}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Presenças em Aulas
                    </p>
                    <p className="text-sm">
                      Total:{' '}
                      <span className="font-medium">
                        {member.presencas_aulas_escolas?.length || 0}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component that includes the dialog trigger and content
export default function MemberDetailsDialog({
  memberId,
  trigger,
}: {
  memberId: string;
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const URL_User = `/users/${memberId}`;

  const { data: session } = useSession();
  const token = session?.user?.token as string;

  const axiosAuth = useAxiosAuth(token);

  const getMember = async () => {
    const { data } = await axiosAuth.get(URL_User);
    return data;
  };

  const { data: member, isLoading: loadingGetMember } = useQuery({
    queryKey: ['detailsMember', memberId],
    queryFn: getMember,
    enabled: isOpen,
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Info className="h-4 w-4" />
            Ver detalhes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-center">Detalhes do Membro</DialogTitle>
          <DialogDescription className="text-center">
            Informações completas sobre o membro
          </DialogDescription>
        </DialogHeader>

        {loadingGetMember ? (
          <MemberDetailsDialogSkeleton />
        ) : (
          <MemberDetailsContent member={member} />
        )}
      </DialogContent>
    </Dialog>
  );
}
