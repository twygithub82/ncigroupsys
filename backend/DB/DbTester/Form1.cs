
using DWMS.DB.Implementation;
using Newtonsoft.Json.Linq;
using static DWMS.DB.Interface.iDatabase;

namespace DbTester
{
    public partial class Form1 : Form
    {
        MySQLWrapper mySQLWrapper;

        public Form1()
        {
            InitializeComponent();
            mySQLWrapper = new MySQLWrapper();
        }

        private async void button1_Click(object sender, EventArgs e)
        {
            (var res, var msg) = await mySQLWrapper.Connect();
            MessageBox.Show(msg);
        }

        private async void button2_Click(object sender, EventArgs e)
        {
            JToken ret = await mySQLWrapper.OpenCloseQueryData("Select * From test");
            MessageBox.Show(ret.ToString());
        }

        private async void button3_Click(object sender, EventArgs e)
        {
            string name = txtName.Text;
            int ret = await mySQLWrapper.OpenCloseExecuteCommand(Operation.UPDATE, $"Update test Set name = '{name}' Where ID = 1");
            if (ret > 0)
                MessageBox.Show("Update Success");
        }

        private async void button4_Click(object sender, EventArgs e)
        {
            string name = txtName.Text;
            string dt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            int ret = await mySQLWrapper.OpenCloseExecuteCommand(Operation.CREATE, $"Insert Into test (name, date) values ('{name}', '{dt}')");
            if (ret > 0)
                MessageBox.Show("Record Created");
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private async void button5_Click(object sender, EventArgs e)
        {
            string name = txtName.Text;
            //string dt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            int ret = await mySQLWrapper.OpenCloseExecuteCommand(Operation.DELETE, $"Delete From test Where name = '{name}'");
            if (ret > 0)
                MessageBox.Show("Record Deleted");
        }
    }
}
