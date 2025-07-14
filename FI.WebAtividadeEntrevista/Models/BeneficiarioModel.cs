using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public int IDBeneficiario { get; set; }
        public string CPFBeneficiario { get; set; }
        public string NomeBeneficiario { get; set; }

        public int IDCliente{ get; set; }
    }
}
