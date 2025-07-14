using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiarios: AcessoDados
    {
        internal void Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.NomeBeneficiario));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPFBeneficiario));
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", beneficiario.IDCliente));
            

            base.Executar("FI_SP_IncluirBeneficiario", parametros);
           
        }

        internal List<DML.Beneficiario> Consultar(long ID)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", ID));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> bnf = Converter(ds);

            return bnf;
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario bnf = new DML.Beneficiario();
                    bnf.IDBeneficiario = int.Parse(row.Field <long>("ID").ToString());
                    bnf.CPFBeneficiario = row.Field<string>("CPF");
                    bnf.NomeBeneficiario = row.Field<string>("Nome");
                    bnf.IDCliente = int.Parse(row.Field<long>("IDCliente").ToString());
                    lista.Add(bnf);
                }
            }

            return lista;
        }

        internal void Alterar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.NomeBeneficiario));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPFBeneficiario));
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", beneficiario.IDBeneficiario));           

            base.Executar("FI_SP_AltBenef", parametros);
        }

        internal bool ExisteBeneficiario(int id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", id));

            DataSet ds = base.Consultar("FI_SP_ExisteBeneficiario", parametros);

            
            if (ds.Tables[0].Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        internal void ExcluirBeneficiario(int id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", id));
            base.Executar("FI_SP_ExcluirBeneficiario", parametros);
        }
    }
}
