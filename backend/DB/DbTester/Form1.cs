
using DWMS.DB.Implementation;

namespace DbTester
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            MySQLWrapper mySQLWrapper = new MySQLWrapper();
            (var res, var msg) = mySQLWrapper.Connect();
            MessageBox.Show(msg);
        }
    }
}
