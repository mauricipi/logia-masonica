const App = () => {
  const [members, setMembers] = React.useState([
    {
      id: 1,
      name: "Juan Pérez",
      cedula: "12345678",
      role: "miembro",
      email: "juan@logia.com",
      celular: "099123456",
      monthlyFee: 1500,
      payments: [
        { id: 1, date: "2024-01-05", amount: 1500, type: "pago", method: "efectivo", reference: null },
        { id: 2, date: "2024-02-03", amount: 3000, type: "pago", method: "transferencia", reference: "comprobante_transferencia.jpg" }
      ],
      sacoBeneficencia: [
        { id: 1, date: "2024-01-10", amount: 500 }
      ],
      masticatoriaTickets: 2,
      username: "juan",
      password: "123456",
      mustChangePassword: true
    },
    {
      id: 2,
      name: "Carlos Gómez",
      cedula: "87654321",
      role: "administrador",
      email: "carlos@logia.com",
      celular: "098654321",
      monthlyFee: 1500,
      payments: [
        { id: 3, date: "2024-01-08", amount: 1500, type: "pago", method: "efectivo", reference: null }
      ],
      sacoBeneficencia: [
        { id: 2, date: "2024-01-12", amount: 300 }
      ],
      masticatoriaTickets: 1,
      username: "carlos",
      password: "123456",
      mustChangePassword: true
    }
  ]);

  const [currentUser, setCurrentUser] = React.useState(null);
  const [currentView, setCurrentView] = React.useState("login");
  const [settings] = React.useState({
    monthlyFee: 1500,
    masticatoriaPrice: 550
  });

  const [financialRecords, setFinancialRecords] = React.useState([
    { id: 1, date: "2024-01-01", description: "Ingreso inicial", amount: 10000, type: "entrada", reference: null },
    { id: 2, date: "2024-01-05", description: "Pago de Juan Pérez", amount: 1500, type: "entrada", reference: null },
    { id: 3, date: "2024-01-10", description: "Compra de mantelería", amount: 1200, type: "salida", reference: "FACT_001.pdf" },
    { id: 4, date: "2024-01-15", description: "Pago interlogia", amount: 800, type: "salida", reference: null }
  ]);

  const [loginForm, setLoginForm] = React.useState({
    username: "",
    password: ""
  });

  const [changePasswordForm, setChangePasswordForm] = React.useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [newPayment, setNewPayment] = React.useState({ 
    memberId: "", 
    amount: "", 
    date: "", 
    method: "efectivo"
  });
  
  const [newSaco, setNewSaco] = React.useState({ 
    date: "", 
    amount: "" 
  });
  
  const [newMasticatoria, setNewMasticatoria] = React.useState({ 
    date: "", 
    attendees: "" 
  });

  const [newFinancialRecord, setNewFinancialRecord] = React.useState({ 
    date: "", 
    description: "", 
    amount: "", 
    type: "entrada"
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const member = members.find(m => m.username === loginForm.username && m.password === loginForm.password);
    
    if (member) {
      setCurrentUser(member);
      if (member.mustChangePassword) {
        setCurrentView("changePassword");
      } else {
        setCurrentView("dashboard");
      }
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (changePasswordForm.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setMembers(members.map(m => 
      m.id === currentUser.id 
        ? { ...m, password: changePasswordForm.newPassword, mustChangePassword: false }
        : m
    ));

    setCurrentUser({...currentUser, password: changePasswordForm.newPassword, mustChangePassword: false});
    setCurrentView("dashboard");
    setChangePasswordForm({ newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("login");
    setLoginForm({ username: "", password: "" });
  };

  const addPayment = () => {
    if (newPayment.memberId && newPayment.amount && newPayment.date) {
      const member = members.find(m => m.id === parseInt(newPayment.memberId));
      if (member) {
        const payment = {
          id: Date.now(),
          date: newPayment.date,
          amount: parseFloat(newPayment.amount),
          type: "pago",
          method: newPayment.method,
          reference: null
        };
        
        setMembers(members.map(m => 
          m.id === parseInt(newPayment.memberId) 
            ? { ...m, payments: [...m.payments, payment] }
            : m
        ));

        setFinancialRecords([
          ...financialRecords,
          {
            id: Date.now(),
            date: newPayment.date,
            description: `Pago de ${member.name}`,
            amount: parseFloat(newPayment.amount),
            type: "entrada",
            reference: null
          }
        ]);

        setNewPayment({ memberId: "", amount: "", date: "", method: "efectivo" });
      }
    }
  };

  const addSacoBeneficencia = () => {
    if (newSaco.amount && newSaco.date) {
      const existingDonation = financialRecords.find(r => 
        r.description === "Donación al Saco Beneficencia" && r.date === newSaco.date
      );

      if (existingDonation) {
        setFinancialRecords(financialRecords.map(r => 
          r.id === existingDonation.id 
            ? { ...r, amount: r.amount + parseFloat(newSaco.amount) }
            : r
        ));
      } else {
        setFinancialRecords([
          ...financialRecords,
          {
            id: Date.now(),
            date: newSaco.date,
            description: "Donación al Saco Beneficencia",
            amount: parseFloat(newSaco.amount),
            type: "entrada",
            reference: null
          }
        ]);
      }

      setNewSaco({ date: "", amount: "" });
    }
  };

  const addMasticatoriaEvent = () => {
    if (newMasticatoria.attendees && newMasticatoria.date) {
      const totalIncome = parseInt(newMasticatoria.attendees) * settings.masticatoriaPrice;
      
      setFinancialRecords([
        ...financialRecords,
        {
          id: Date.now(),
          date: newMasticatoria.date,
          description: `Masticatoria - ${newMasticatoria.attendees} asistentes`,
          amount: totalIncome,
          type: "entrada",
          reference: null
        }
      ]);

      setNewMasticatoria({ date: "", attendees: "" });
    }
  };

  const addFinancialRecord = () => {
    if (newFinancialRecord.description && newFinancialRecord.amount && newFinancialRecord.date) {
      setFinancialRecords([
        ...financialRecords,
        {
          id: Date.now(),
          date: newFinancialRecord.date,
          description: newFinancialRecord.description,
          amount: parseFloat(newFinancialRecord.amount),
          type: newFinancialRecord.type,
          reference: null
        }
      ]);
      setNewFinancialRecord({ date: "", description: "", amount: "", type: "entrada" });
    }
  };

  const calculateMemberBalance = (member) => {
    const totalDue = 10 * member.monthlyFee;
    const totalPaid = member.payments.reduce((sum, p) => sum + p.amount, 0);
    const cuotasPagadas = Math.floor(totalPaid / member.monthlyFee);
    const cuotasDebidas = 10 - cuotasPagadas;
    
    return {
      debe: totalDue,
      haber: totalPaid,
      saldo: totalPaid - totalDue,
      cuotasPagadas,
      cuotasDebidas
    };
  };

  const calculateTotalSaco = () => {
    return financialRecords
      .filter(r => r.description === "Donación al Saco Beneficencia")
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const calculateMasticatoriaStats = () => {
    const masticatoriaRecords = financialRecords.filter(r => r.description.includes("Masticatoria"));
    const totalIncome = masticatoriaRecords.reduce((sum, r) => sum + r.amount, 0);
    
    return { totalIncome };
  };

  const calculateGeneralLedger = () => {
    const ledger = [...financialRecords];
    
    members.forEach(member => {
      member.payments.forEach(payment => {
        ledger.push({
          id: `pago-${payment.id}`,
          date: payment.date,
          description: `Pago mensual - ${member.name}`,
          amount: payment.amount,
          type: "entrada",
          reference: payment.reference
        });
      });
    });
    
    return ledger.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const generalLedger = calculateGeneralLedger();
  const totalIncome = generalLedger.filter(r => r.type === "entrada").reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = generalLedger.filter(r => r.type === "salida").reduce((sum, r) => sum + r.amount, 0);
  const generalBalance = totalIncome - totalExpenses;

  const MemberDashboard = () => {
    const balance = calculateMemberBalance(currentUser);
    
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
          <h2 className="text-2xl font-bold text-white mb-6">Estado de Cuenta - {currentUser.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-slate-200 text-sm mb-1">Cuotas Pagadas</div>
              <div className="text-2xl font-bold text-white">{balance.cuotasPagadas}/10</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-slate-200 text-sm mb-1">Cuotas Pendientes</div>
              <div className="text-2xl font-bold text-white">{balance.cuotasDebidas}</div>
            </div>
            <div className={`bg-white/10 rounded-xl p-4 ${balance.saldo >= 0 ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'}`}>
              <div className="text-slate-200 text-sm mb-1">Saldo</div>
              <div className={`text-2xl font-bold ${balance.saldo >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${balance.saldo.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Historial de Pagos</h3>
            <div className="space-y-3">
              {currentUser.payments.map(payment => (
                <div key={payment.id} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{payment.date}</div>
                    <div className="text-slate-200 text-sm">Método: {payment.method === 'efectivo' ? 'Efectivo' : 'Transferencia'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${payment.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-100 text-sm">Ingresos Totales</div>
              <div className="text-3xl font-bold">${totalIncome.toLocaleString()}</div>
            </div>
            <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-red-100 text-sm">Egresos Totales</div>
              <div className="text-3xl font-bold">${totalExpenses.toLocaleString()}</div>
            </div>
            <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2m0 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c1.11 0 2.08.402 2.599 1" />
            </svg>
          </div>
        </div>

        <div className={`bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white ${generalBalance >= 0 ? 'from-blue-600 to-blue-700' : 'from-orange-600 to-orange-700'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-100 text-sm">Balance General</div>
              <div className="text-3xl font-bold">${generalBalance.toLocaleString()}</div>
            </div>
            <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-purple-100 text-sm">Saco Beneficencia</div>
              <div className="text-3xl font-bold">${calculateTotalSaco().toLocaleString()}</div>
            </div>
            <svg className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
        <h3 className="text-xl font-bold text-white mb-6">Miembros y Estado de Cuenta</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-slate-600/30">
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-center py-3 px-4">Cuotas Pagadas</th>
                <th className="text-center py-3 px-4">Cuotas Pendientes</th>
                <th className="text-right py-3 px-4">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const balance = calculateMemberBalance(member);
                return (
                  <tr key={member.id} className="border-b border-slate-600/20 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{member.name}</div>
                      <div className="text-slate-200 text-sm">{member.email}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-green-600 text-green-100 px-2 py-1 rounded-full text-sm">
                        {balance.cuotasPagadas}/10
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-red-600 text-red-100 px-2 py-1 rounded-full text-sm">
                        {balance.cuotasDebidas}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      balance.saldo >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${balance.saldo.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-slate-600/30 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Logia Masónica</h1>
            <p className="text-slate-100">Sistema de Gestión Financiera</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-200 mb-2">Usuario</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            
            <div>
              <label className="block text-slate-200 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300 pr-10"
                  placeholder="Ingrese su contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
          
          <div className="mt-6 text-center text-slate-200 text-sm">
            <p>Usuarios por defecto:</p>
            <p>Usuario: <span className="font-bold">juan</span> / Contraseña: <span className="font-bold">123456</span></p>
            <p>Usuario: <span className="font-bold">carlos</span> / Contraseña: <span className="font-bold">123456</span></p>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "changePassword") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-slate-600/30 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Cambiar Contraseña</h1>
            <p className="text-slate-100">Debe cambiar su contraseña por seguridad</p>
            <p className="text-yellow-200 text-sm mt-2">Hola, {currentUser?.name}</p>
          </div>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-slate-200 mb-2">Nueva Contraseña</label>
              <input
                type="password"
                value={changePasswordForm.newPassword}
                onChange={(e) => setChangePasswordForm({...changePasswordForm, newPassword: e.target.value})}
                className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                placeholder="Ingrese nueva contraseña"
                required
                minLength={6}
              />
              <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres</p>
            </div>
            
            <div>
              <label className="block text-slate-200 mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                value={changePasswordForm.confirmPassword}
                onChange={(e) => setChangePasswordForm({...changePasswordForm, confirmPassword: e.target.value})}
                className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                placeholder="Confirme la contraseña"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-white/10 backdrop-blur-lg border-b border-slate-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Logia Masónica</h1>
                <p className="text-slate-200 text-sm">Sistema de Gestión Financiera</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-medium">{currentUser.name}</div>
                <div className="text-slate-200 text-sm capitalize">{currentUser.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="flex space-x-1 bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-slate-600/30">
            {currentUser.role === 'administrador' && (
              <>
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "dashboard" 
                      ? "bg-slate-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView("payments")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "payments" 
                      ? "bg-slate-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Pagos
                </button>
                <button
                  onClick={() => setCurrentView("saco")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "saco" 
                      ? "bg-slate-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Saco Beneficencia
                </button>
                <button
                  onClick={() => setCurrentView("masticatoria")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "masticatoria" 
                      ? "bg-slate-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Masticatoria
                </button>
                <button
                  onClick={() => setCurrentView("finances")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "finances" 
                      ? "bg-slate-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Entradas/Salidas
                </button>
                <button
                  onClick={() => setCurrentView("ledger")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    currentView === "ledger" 
                      ? "bg-yellow-600 text-white shadow-lg" 
                      : "text-slate-200 hover:text-white hover:bg-white/20"
                  }`}
                >
                  Libro Mayor
                </button>
              </>
            )}
            {currentUser.role === 'miembro' && (
              <button
                onClick={() => setCurrentView("account")}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentView === "account" 
                    ? "bg-slate-600 text-white shadow-lg" 
                    : "text-slate-200 hover:text-white hover:bg-white/20"
                }`}
              >
                Mi Estado de Cuenta
              </button>
            )}
          </div>
        </nav>

        {currentUser.role === 'miembro' && currentView === 'account' && <MemberDashboard />}
        {currentUser.role === 'administrador' && currentView === 'dashboard' && <AdminDashboard />}
        
        {currentUser.role === 'administrador' && currentView === 'payments' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-6">Registrar Pago</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <select
                  value={newPayment.memberId}
                  onChange={(e) => setNewPayment({...newPayment, memberId: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                  style={{ color: 'black' }}
                >
                  <option value="" style={{ color: 'black' }}>Seleccionar miembro</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id} style={{ color: 'black' }}>
                      {member.name}
                    </option>
                  ))}
                </select>
                
                <input
                  type="number"
                  placeholder="Monto"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                />
                
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                />
                
                <div className="space-y-2">
                  <label className="block text-slate-200">Método de Pago</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="efectivo"
                        checked={newPayment.method === "efectivo"}
                        onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                        className="mr-2 text-slate-600"
                      />
                      <span className="text-white">Efectivo</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="transferencia"
                        checked={newPayment.method === "transferencia"}
                        onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                        className="mr-2 text-slate-600"
                      />
                      <span className="text-white">Transferencia</span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={addPayment}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'administrador' && currentView === 'saco' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-6">Saco Beneficencia</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Registrar Donación</h4>
                <input
                  type="date"
                  value={newSaco.date}
                  onChange={(e) => setNewSaco({...newSaco, date: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                />
                
                <input
                  type="number"
                  placeholder="Monto total del día"
                  value={newSaco.amount}
                  onChange={(e) => setNewSaco({...newSaco, amount: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                />
                
                <button
                  onClick={addSacoBeneficencia}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Registrar Donación del Día
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'administrador' && currentView === 'masticatoria' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-6">Masticatoria</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">Registrar Evento</h4>
                <input
                  type="date"
                  value={newMasticatoria.date}
                  onChange={(e) => setNewMasticatoria({...newMasticatoria, date: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                />
                
                <input
                  type="number"
                  placeholder="Cantidad de asistentes"
                  value={newMasticatoria.attendees}
                  onChange={(e) => setNewMasticatoria({...newMasticatoria, attendees: e.target.value})}
                  className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                />
                
                <button
                  onClick={addMasticatoriaEvent}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Registrar Masticatoria
                </button>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'administrador' && currentView === 'finances' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-6">Entradas y Salidas</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input
                    type="date"
                    value={newFinancialRecord.date}
                    onChange={(e) => setNewFinancialRecord({...newFinancialRecord, date: e.target.value})}
                    className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                  />
                  
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={newFinancialRecord.description}
                    onChange={(e) => setNewFinancialRecord({...newFinancialRecord, description: e.target.value})}
                    className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                  />
                  
                  <input
                    type="number"
                    placeholder="Monto"
                    value={newFinancialRecord.amount}
                    onChange={(e) => setNewFinancialRecord({...newFinancialRecord, amount: e.target.value})}
                    className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white placeholder-slate-300"
                  />
                  
                  <select
                    value={newFinancialRecord.type}
                    onChange={(e) => setNewFinancialRecord({...newFinancialRecord, type: e.target.value})}
                    className="w-full bg-white/20 border border-slate-600/30 rounded-lg px-4 py-2 text-white"
                    style={{ color: 'black' }}
                  >
                    <option value="entrada" style={{ color: 'black' }}>Entrada</option>
                    <option value="salida" style={{ color: 'black' }}>Salida</option>
                  </select>
                  
                  <button
                    onClick={addFinancialRecord}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Registrar Movimiento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentUser.role === 'administrador' && currentView === 'ledger' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-slate-600/30">
            <h3 className="text-xl font-bold text-white mb-6">Libro Mayor</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-slate-600/30">
                    <th className="text-left py-3 px-4">Fecha</th>
                    <th className="text-left py-3 px-4">Descripción</th>
                    <th className="text-right py-3 px-4">Debe</th>
                    <th className="text-right py-3 px-4">Haber</th>
                    <th className="text-right py-3 px-4">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {generalLedger.map((record, index) => {
                    const previousBalance = index > 0 ? 
                      (index === 1 ? 0 : 
                        generalLedger.slice(0, index).reduce((sum, r) => 
                          sum + (r.type === 'entrada' ? r.amount : -r.amount), 0)) : 0;
                    const currentBalance = previousBalance + (record.type === 'entrada' ? record.amount : -record.amount);
                    
                    return (
                      <tr key={record.id} className="border-b border-slate-600/20 hover:bg-white/5">
                        <td className="py-3 px-4">{record.date}</td>
                        <td className="py-3 px-4">{record.description}</td>
                        <td className="py-3 px-4 text-right">
                          {record.type === 'salida' && `${record.amount.toLocaleString()}`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {record.type === 'entrada' && `${record.amount.toLocaleString()}`}
                        </td>
                        <td className={`py-3 px-4 text-right font-medium ${
                          currentBalance >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          ${currentBalance.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-slate-600/50 font-bold">
                    <td colSpan={2} className="py-3 px-4">TOTAL GENERAL</td>
                    <td className="py-3 px-4 text-right">
                      ${generalLedger.filter(r => r.type === 'salida').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ${generalLedger.filter(r => r.type === 'entrada').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      generalBalance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${generalBalance.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
