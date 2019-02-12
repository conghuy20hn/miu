<?php

namespace backend\models;

use Yii;
use yii\base\Model;
use yii\data\ActiveDataProvider;
use backend\models\DlSpamSms;

/**
 * DlSpamSmsSearch represents the model behind the search form about `backend\models\DlSpamSms`.
 */
class DlSpamSmsSearch extends DlSpamSms
{
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['id', 'product_id', 'start_time', 'end_time', 'time_wait', 'status'], 'integer'],
            [['name', 'product_code', 'dealer_id', 'dealer_name', 'file_path', 'list_msisdn_test', 'created_at', 'updated_at'], 'safe'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = DlSpamSms::find();

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'sort' => ['defaultOrder' => ['id' => SORT_DESC]]
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        $query->andFilterWhere([
            'id' => $this->id,
            'product_id' => $this->product_id,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'time_wait' => $this->time_wait,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ]);

        $query->andFilterWhere(['like', 'name', $this->name])
            ->andFilterWhere(['like', 'product_code', $this->product_code])
            ->andFilterWhere(['like', 'dealer_id', $this->dealer_id])
            ->andFilterWhere(['like', 'dealer_name', $this->dealer_name])
            ->andFilterWhere(['like', 'file_path', $this->file_path])
            ->andFilterWhere(['like', 'list_msisdn_test', $this->list_msisdn_test]);

        return $dataProvider;
    }
}
