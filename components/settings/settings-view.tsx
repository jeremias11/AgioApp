"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Database, Shield, Download, Upload } from "lucide-react"

export function SettingsView() {
  const [companyName, setCompanyName] = useState("LoanManager")
  const [defaultInterestRate, setDefaultInterestRate] = useState("5")
  const [defaultPaymentDay, setDefaultPaymentDay] = useState("15")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [whatsappNotifications, setWhatsappNotifications] = useState(false)
  const [reminderDays, setReminderDays] = useState("3")
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")

  const handleSaveGeneral = () => {
    alert("Configurações gerais salvas com sucesso!")
    // Implementação real: salvar no banco de dados
  }

  const handleSaveNotifications = () => {
    alert("Configurações de notificações salvas com sucesso!")
    // Implementação real: salvar no banco de dados
  }

  const handleBackupNow = () => {
    alert("Iniciando backup manual...")
    // Implementação real: executar backup
  }

  const handleImportData = () => {
    alert("Funcionalidade de importação em desenvolvimento")
    // Implementação real: importar dados
  }

  const handleExportData = () => {
    alert("Exportando dados...")
    // Implementação real: exportar dados
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-500">Gerencie as configurações do sistema</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="defaultInterestRate">Taxa de Juros Padrão (%)</Label>
                  <Input
                    id="defaultInterestRate"
                    type="number"
                    step="0.1"
                    value={defaultInterestRate}
                    onChange={(e) => setDefaultInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultPaymentDay">Dia de Pagamento Padrão</Label>
                  <Input
                    id="defaultPaymentDay"
                    type="number"
                    min="1"
                    max="31"
                    value={defaultPaymentDay}
                    onChange={(e) => setDefaultPaymentDay(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contractTemplate">Modelo de Contrato</Label>
                <Textarea
                  id="contractTemplate"
                  rows={6}
                  placeholder="Digite o modelo padrão do contrato..."
                  defaultValue="CONTRATO DE EMPRÉSTIMO

Pelo presente instrumento particular, as partes:

CREDOR: [NOME_EMPRESA]
DEVEDOR: [NOME_CLIENTE]

Têm entre si justo e acordado o seguinte:

1. O CREDOR empresta ao DEVEDOR a quantia de R$ [VALOR_EMPRESTIMO]
2. Taxa de juros: [TAXA_JUROS]% ao mês
3. Data de vencimento: [DATA_VENCIMENTO]
4. Forma de pagamento: [FORMA_PAGAMENTO]

[CIDADE], [DATA]

_________________        _________________
    CREDOR                  DEVEDOR"
                />
              </div>

              <Button onClick={handleSaveGeneral} className="w-full">
                Salvar Configurações Gerais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Notificações por Email</Label>
                    <p className="text-sm text-gray-500">Receber alertas de vencimento por email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whatsappNotifications">Notificações por WhatsApp</Label>
                    <p className="text-sm text-gray-500">Enviar lembretes automáticos via WhatsApp</p>
                  </div>
                  <Switch
                    id="whatsappNotifications"
                    checked={whatsappNotifications}
                    onCheckedChange={setWhatsappNotifications}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="reminderDays">Lembrete (dias antes do vencimento)</Label>
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 dia</SelectItem>
                      <SelectItem value="3">3 dias</SelectItem>
                      <SelectItem value="5">5 dias</SelectItem>
                      <SelectItem value="7">7 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Mensagens Personalizadas</Label>
                <div>
                  <Label htmlFor="reminderMessage">Mensagem de Lembrete</Label>
                  <Textarea
                    id="reminderMessage"
                    rows={3}
                    defaultValue="Olá [NOME_CLIENTE], seu pagamento de R$ [VALOR] vence em [DIAS] dias. Por favor, entre em contato para confirmar."
                  />
                </div>
                <div>
                  <Label htmlFor="overdueMessage">Mensagem de Atraso</Label>
                  <Textarea
                    id="overdueMessage"
                    rows={3}
                    defaultValue="Olá [NOME_CLIENTE], seu pagamento de R$ [VALOR] está atrasado há [DIAS] dias. Por favor, entre em contato urgentemente."
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="w-full">
                Salvar Configurações de Notificações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Backup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Backup Automático</Label>
                  <p className="text-sm text-gray-500">Realizar backup automático dos dados</p>
                </div>
                <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              {autoBackup && (
                <div>
                  <Label htmlFor="backupFrequency">Frequência do Backup</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label>Backup Manual</Label>
                  <p className="text-sm text-gray-500 mb-2">Faça um backup imediato dos seus dados</p>
                  <Button onClick={handleBackupNow} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Fazer Backup Agora
                  </Button>
                </div>

                <div>
                  <Label>Importar/Exportar Dados</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Button variant="outline" onClick={handleImportData}>
                      <Upload className="h-4 w-4 mr-2" />
                      Importar Dados
                    </Button>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Dados
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Último Backup</h4>
                <p className="text-sm text-yellow-700">15/02/2024 às 14:30</p>
                <p className="text-sm text-yellow-700">Tamanho: 2.5 MB</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Alterar Senha</Label>
                <div className="space-y-4 mt-2">
                  <div>
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button className="w-full">Alterar Senha</Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Sessões Ativas</Label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Navegador Atual</p>
                      <p className="text-sm text-gray-500">Chrome - Windows • Agora</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Atual
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Mobile</p>
                      <p className="text-sm text-gray-500">Safari - iPhone • 2 horas atrás</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Encerrar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Zona de Perigo</h4>
                <p className="text-sm text-red-700 mb-4">Ações irreversíveis que afetam permanentemente seus dados.</p>
                <Button variant="destructive" className="w-full">
                  Excluir Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
