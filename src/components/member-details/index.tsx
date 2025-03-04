import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  School,
  Users,
  BookOpen,
  Award,
  Heart,
  Home,
  UserCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Member } from './schema';

export default function MemberDetails({ member }: { member?: Member }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Profile header */}
        <div>
          <Card>
            <CardHeader className="flex flex-col items-center text-center pb-2">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage
                  src={member?.image_url}
                  alt={`${member?.first_name} ${member?.last_name}`}
                />
                <AvatarFallback className="text-3xl">
                  {getInitials(
                    member?.first_name || '',
                    member?.last_name || '',
                  )}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">
                {member?.first_name} {member?.last_name}
              </CardTitle>
              <Badge className="mt-2">{member?.role}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{member?.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(member?.date_nascimento)}
                </span>
              </div>
              {member?.cidade && member?.estado && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {member?.cidade}, {member?.estado}
                  </span>
                </div>
              )}
              <Separator />
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discipleship Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Discipulado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  Discípulos
                </h4>
                <div className="pl-6">
                  {discipulos && discipulos.length > 0 ? (
                    discipulos?.map((nome, index) => (
                      <li key={index} className="text-sm">
                        {nome}
                      </li>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Não possui discípulos
                    </div>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Discipulador
                </h4>
                <div className="pl-6">
                  {discipulador && discipulador.length > 0 ? (
                    discipulador.map((nome, index) => (
                      <div key={index} className="text-sm">
                        {nome}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Não possui discipulador
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Tabs with details */}
        <div className="w-2/3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 w-full">
              <TabsTrigger value="personal">Pessoal</TabsTrigger>
              <TabsTrigger value="church">Igreja</TabsTrigger>
              <TabsTrigger value="leadership">Liderança</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nome Completo
                    </p>
                    <p>
                      {member?.first_name} {member?.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Data de Nascimento
                    </p>
                    <p>{formatDate(member?.date_nascimento)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Sexo
                    </p>
                    <p>{member?.sexo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      CPF
                    </p>
                    <p>{member?.cpf || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Estado Civil
                    </p>
                    <p>{member?.estado_civil}</p>
                  </div>
                  {member?.nome_conjuge && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Cônjuge
                      </p>
                      <p>{member?.nome_conjuge}</p>
                    </div>
                  )}
                  {member?.date_casamento && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data de Casamento
                      </p>
                      <p>{formatDate(member?.date_casamento)}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Filhos
                    </p>
                    <p>
                      {member?.has_filho
                        ? `Sim (${member?.quantidade_de_filho || 'quantidade não informada'})`
                        : 'Não'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contato e Endereço</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p>{member?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Telefone
                    </p>
                    <p>{member?.telefone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      CEP
                    </p>
                    <p>{member?.cep || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Cidade/Estado
                    </p>
                    <p>
                      {member?.cidade && member?.estado
                        ? `${member?.cidade}/${member?.estado}`
                        : 'Não informado'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Bairro
                    </p>
                    <p>{member?.bairro || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Endereço
                    </p>
                    <p>
                      {member?.endereco && member?.numero_casa
                        ? `${member?.endereco}, ${member?.numero_casa}`
                        : 'Não informado'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profissional</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Escolaridade
                    </p>
                    <p>{member?.escolaridade}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Profissão
                    </p>
                    <p>{member?.profissao || 'Não informado'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Church Information Tab */}
            <TabsContent value="church" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações na Igreja
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Supervisão
                    </p>
                    <p>
                      {member?.supervisao_pertence?.nome || 'Não informado'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Célula
                    </p>
                    <p>{member?.celula?.nome || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Batizado
                    </p>
                    <p>{member?.batizado ? 'Sim' : 'Não'}</p>
                  </div>
                  {member?.batizado && member?.date_batizado && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Data do Batismo
                      </p>
                      <p>{formatDate(member?.date_batizado)}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Data de Decisão
                    </p>
                    <p>
                      {member?.date_decisao
                        ? formatDate(member?.date_decisao)
                        : 'Não informado'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Situação no Reino
                    </p>
                    <p>{member?.situacao_no_reino?.nome || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      É Discipulado
                    </p>
                    <p>{member?.is_discipulado ? 'Sim' : 'Não'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Escolas e Encontros</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      Escolas
                    </h4>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {member?.escolas && member?.escolas.length > 0 ? (
                        member?.escolas.map((escola) => (
                          <Badge key={escola.id} variant="secondary">
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
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      Encontros
                    </h4>
                    <div className="pl-6 flex flex-wrap gap-2">
                      {member?.encontros && member?.encontros.length > 0 ? (
                        member?.encontros.map((encontro, index) => (
                          <Badge key={encontro.id} variant="secondary">
                            {encontro
                              ? encontro.nome
                              : (encontro ?? 'Encontro não informado')}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum encontro realizado
                        </p>
                      )}
                    </div>
                  </div>
                  {member?.TurmaEscola && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        Turma Atual
                      </h4>
                      <div className="pl-6">
                        <Badge variant="outline">{member?.TurmaEscola}</Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leadership Tab */}
            <TabsContent value="leadership" className="space-y-6 w-full">
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
                      {member?.cargo_de_lideranca?.nome ||
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

                  {member?.escola_lidera &&
                    member?.escola_lidera.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <School className="h-4 w-4 text-muted-foreground" />
                          Escolas que Lidera
                        </h4>
                        <div className="pl-6 flex flex-wrap gap-2">
                          {member?.escolas && member?.escolas.length > 0 ? (
                            member?.escolas.map((escola) => (
                              <Badge key={escola.id} variant="secondary">
                                {escola
                                  ? escola.nome
                                  : (escola ?? 'Escola não informada')}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Nenhuma escola concluída
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                  {member?.supervisoes_lidera &&
                    member?.supervisoes_lidera.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          Supervisões que Lidera
                        </h4>
                        <div className="pl-6 flex flex-wrap gap-2">
                          {member?.supervisoes_lidera.map(
                            (supervisao, index) => (
                              <Badge key={index} variant="secondary">
                                {typeof supervisao === 'string'
                                  ? supervisao
                                  : (supervisao ?? 'Supervisão não informada')}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Presenças</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member?.presencas_cultos &&
                    member?.presencas_cultos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-muted-foreground" />
                          Presenças em Cultos
                        </h4>
                        <div className="pl-6">
                          <p className="text-sm">
                            Total:{' '}
                            <span className="font-medium">
                              {member?.presencas_cultos.length}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}

                  {member?.presencas_aulas_escolas &&
                    member?.presencas_aulas_escolas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          Presenças em Aulas
                        </h4>
                        <div className="pl-6">
                          <p className="text-sm">
                            Total:{' '}
                            <span className="font-medium">
                              {member?.presencas_aulas_escolas.length}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
