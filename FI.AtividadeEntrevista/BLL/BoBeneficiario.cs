using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public List<DML.Beneficiario> Consultar(long id)
        {
            DAL.DaoBeneficiarios bnf = new DAL.DaoBeneficiarios();
            return bnf.Consultar(id);
        }
    }
}
